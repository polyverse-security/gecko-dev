/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Test the Runtime execution context events

const DOC = toDataURL("default-test-page");
const DOC_IFRAME = toDataURL(`<iframe src='${DOC}'></iframe>`);

const DESTROYED = "Runtime.executionContextDestroyed";
const CREATED = "Runtime.executionContextCreated";
const CLEARED = "Runtime.executionContextsCleared";

add_task(async function noEventsWhenRuntimeDomainDisabled({ client }) {
  const { Runtime } = client;

  const history = recordContextEvents(Runtime, 0);
  await loadURL(DOC);
  await assertEventOrder({ history, expectedEvents: [] });
});

add_task(async function noEventsAfterRuntimeDomainDisabled({ client }) {
  const { Runtime } = client;

  await Runtime.enable();
  await Runtime.disable();

  const history = recordContextEvents(Runtime, 0);
  await loadURL(DOC);
  await assertEventOrder({ history, expectedEvents: [] });
});

add_task(async function eventsWhenNavigatingWithNoFrames({ client }) {
  const { Page, Runtime } = client;

  const previousContext = await enableRuntime(client);
  const history = recordContextEvents(Runtime, 3);

  const { frameId } = await Page.navigate({ url: DOC });
  await assertEventOrder({ history });

  const { executionContextId: destroyedId } = history.findEvent(DESTROYED);
  is(
    destroyedId,
    previousContext.id,
    "The destroyed event reports the previous context id"
  );

  const { context: contextCreated } = history.findEvent(CREATED);
  checkDefaultContext(contextCreated);
  isnot(
    contextCreated.id,
    previousContext.id,
    "The new execution context has a different id"
  );
  is(
    contextCreated.auxData.frameId,
    frameId,
    "The execution context frame id is the same " +
      "than the one returned by Page.navigate"
  );
});

add_task(async function eventsWhenNavigatingFrameSet({ client }) {
  const { Runtime } = client;

  const previousContext = await enableRuntime(client);

  // Check navigation to a frameset
  const historyTo = recordContextEvents(Runtime, 4);
  await loadURL(DOC_IFRAME);
  await assertEventOrder({
    history: historyTo,
    expectedEvents: [DESTROYED, CLEARED, CREATED, CREATED],
  });

  const { executionContextId: destroyedId } = historyTo.findEvent(DESTROYED);
  is(
    destroyedId,
    previousContext.id,
    "The destroyed event reports the previous context id"
  );

  const contexts = historyTo.findEvents(CREATED);
  const createdTopContext = contexts[0].context;
  const createdFrameContext = contexts[1].context;

  checkDefaultContext(createdTopContext);
  isnot(
    createdTopContext.id,
    previousContext.id,
    "The new execution context has a different id"
  );
  is(
    createdTopContext.origin,
    DOC_IFRAME,
    "The execution context origin is the frameset"
  );

  checkDefaultContext(createdFrameContext);
  isnot(
    createdFrameContext.id,
    createdTopContext.id,
    "The new frame's execution context has a different id"
  );
  is(
    createdFrameContext.origin,
    DOC,
    "The frame's execution context origin is the frame"
  );

  // Check navigation from a frameset
  const historyFrom = recordContextEvents(Runtime, 4);
  await loadURL(DOC);
  await assertEventOrder({
    history: historyFrom,
    expectedEvents: [DESTROYED, CLEARED, DESTROYED, CLEARED, CREATED],
  });

  const destroyedContextIds = historyFrom.findEvents(DESTROYED);
  is(
    destroyedContextIds[0].executionContextId,
    createdTopContext.id,
    "The destroyed event reports the previous context id"
  );
  is(
    destroyedContextIds[1].executionContextId,
    createdFrameContext.id,
    "The destroyed event reports the previous frame's context id"
  );

  const { context: contextCreated } = historyFrom.findEvent(CREATED);
  checkDefaultContext(contextCreated);
  isnot(
    contextCreated.id,
    createdTopContext.id,
    "The new execution context has a different id"
  );
  is(
    contextCreated.origin,
    DOC,
    "The execution context origin is not the frameset"
  );
});

add_task(async function eventsWhenNavigatingBackWithNoFrames({ client }) {
  const { Runtime } = client;

  // Load an initial URL so that navigating back will work
  await loadURL(DOC);
  const previousContext = await enableRuntime(client);

  const executionContextCreated = Runtime.executionContextCreated();
  await loadURL(toDataURL("other-test-page"));
  const { context: createdContext } = await executionContextCreated;

  const history = recordContextEvents(Runtime, 3);
  gBrowser.selectedBrowser.goBack();
  await assertEventOrder({ history });

  const { executionContextId: destroyedId } = history.findEvent(DESTROYED);
  is(
    destroyedId,
    createdContext.id,
    "The destroyed event reports the current context id"
  );

  const { context } = history.findEvent(CREATED);
  checkDefaultContext(context);
  is(
    context.origin,
    previousContext.origin,
    "The new execution context has the same origin as the previous one."
  );
  isnot(
    context.id,
    previousContext.id,
    "The new execution context has a different id"
  );
  ok(context.auxData.isDefault, "The execution context is the default one");
  is(
    context.auxData.frameId,
    previousContext.auxData.frameId,
    "The execution context frame id is always the same"
  );
  is(context.auxData.type, "default", "Execution context has 'default' type");
  is(context.name, "", "The default execution context is named ''");

  const { result } = await Runtime.evaluate({
    contextId: context.id,
    expression: "location.href",
  });
  is(
    result.value,
    DOC,
    "Runtime.evaluate works and is against the page we just navigated to"
  );
});

add_task(async function eventsWhenReloadingPageWithNoFrames({ client }) {
  const { Page, Runtime } = client;

  // Load an initial URL so that reload will work
  await loadURL(DOC);
  const previousContext = await enableRuntime(client);

  await Page.enable();

  const history = recordContextEvents(Runtime, 3);
  const frameNavigated = Page.frameNavigated();
  gBrowser.selectedBrowser.reload();
  await frameNavigated;

  await assertEventOrder({ history });

  const { executionContextId } = history.findEvent(DESTROYED);
  is(
    executionContextId,
    previousContext.id,
    "The destroyed event reports the previous context id"
  );

  const { context } = history.findEvent(CREATED);
  checkDefaultContext(context);
  is(
    context.auxData.frameId,
    previousContext.auxData.frameId,
    "The execution context frame id is the same as before reloading"
  );

  isnot(
    executionContextId,
    context.id,
    "The destroyed id is different from the created one"
  );
});

add_task(async function eventsWhenNavigatingByLocationWithNoFrames({ client }) {
  const { Runtime } = client;

  const previousContext = await enableRuntime(client);
  const history = recordContextEvents(Runtime, 3);

  await Runtime.evaluate({
    contextId: previousContext.id,
    expression: `window.location = '${DOC}';`,
  });
  await assertEventOrder({ history });

  const { executionContextId: destroyedId } = history.findEvent(DESTROYED);
  is(
    destroyedId,
    previousContext.id,
    "The destroyed event reports the previous context id"
  );

  const { context: createdContext } = history.findEvent(CREATED);
  checkDefaultContext(createdContext);
  is(
    createdContext.auxData.frameId,
    previousContext.auxData.frameId,
    "The execution context frame id is identical " +
      "to the one from before before setting the window's location"
  );
  isnot(
    destroyedId,
    createdContext.id,
    "The destroyed id is different from the created one"
  );
});

function recordContextEvents(Runtime, total) {
  const history = new RecordEvents(total);

  history.addRecorder({
    event: Runtime.executionContextDestroyed,
    eventName: DESTROYED,
    messageFn: payload => {
      return `Received ${DESTROYED} for id ${payload.executionContextId}`;
    },
  });
  history.addRecorder({
    event: Runtime.executionContextCreated,
    eventName: CREATED,
    messageFn: payload => {
      return (
        `Received ${CREATED} for id ${payload.context.id}` +
        ` type: ${payload.context.auxData.type}` +
        ` name: ${payload.context.name}` +
        ` origin: ${payload.context.origin}`
      );
    },
  });
  history.addRecorder({
    event: Runtime.executionContextsCleared,
    eventName: CLEARED,
  });

  return history;
}

async function assertEventOrder(options = {}) {
  const {
    history,
    expectedEvents = [DESTROYED, CLEARED, CREATED],
    timeout,
  } = options;
  const events = await history.record(timeout);
  const eventNames = events.map(item => item.eventName);
  info(`Expected events: ${expectedEvents}`);
  info(`Received events: ${eventNames}`);

  is(
    events.length,
    expectedEvents.length,
    "Received expected number of Runtime context events"
  );
  Assert.deepEqual(
    events.map(item => item.eventName),
    expectedEvents,
    "Received Runtime context events in expected order"
  );
}

function checkDefaultContext(context) {
  ok(!!context.id, "The execution context has an id");
  ok(context.auxData.isDefault, "The execution context is the default one");
  is(context.auxData.type, "default", "Execution context has 'default' type");
  ok(!!context.origin, "The execution context has an origin");
  is(context.name, "", "The default execution context is named ''");
}
