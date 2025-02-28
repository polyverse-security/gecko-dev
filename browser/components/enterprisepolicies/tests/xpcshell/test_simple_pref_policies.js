/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/*
 * Use this file to add tests to policies that are
 * simple pref flips.
 *
 * It's best to make a test to actually test the feature
 * instead of the pref flip, but if that feature is well
 * covered by tests, including that its pref actually works,
 * it's OK to have the policy test here just to ensure
 * that the right pref values are set.
 */

const POLICIES_TESTS = [
  /*
   * Example:
   * {
   *   // Policies to be set at once through the engine
   *   policies: { "DisableFoo": true, "ConfigureBar": 42 },
   *
   *   // Locked prefs to check
   *   lockedPrefs: { "feature.foo": false },
   *
   *   // Unlocked prefs to check
   *   unlockedPrefs: { "bar.baz": 42 }
   * },
   */

  // POLICY: RememberPasswords
  {
    policies: { OfferToSaveLogins: false },
    lockedPrefs: { "signon.rememberSignons": false },
  },
  {
    policies: { OfferToSaveLogins: true },
    lockedPrefs: { "signon.rememberSignons": true },
  },

  // POLICY: DisableSecurityBypass
  {
    policies: {
      DisableSecurityBypass: {
        InvalidCertificate: true,
        SafeBrowsing: true,
      },
    },
    lockedPrefs: {
      "security.certerror.hideAddException": true,
      "browser.safebrowsing.allowOverride": false,
    },
  },

  // POLICY: DisableBuiltinPDFViewer
  {
    policies: { DisableBuiltinPDFViewer: true },
    lockedPrefs: { "pdfjs.disabled": true },
  },

  // POLICY: DisableFormHistory
  {
    policies: { DisableFormHistory: true },
    lockedPrefs: { "browser.formfill.enable": false },
  },

  // POLICY: EnableTrackingProtection
  {
    policies: {
      EnableTrackingProtection: {
        Value: true,
      },
    },
    unlockedPrefs: {
      "privacy.trackingprotection.enabled": true,
      "privacy.trackingprotection.pbmode.enabled": true,
    },
  },
  {
    policies: {
      EnableTrackingProtection: {
        Value: false,
        Locked: true,
      },
    },
    lockedPrefs: {
      "privacy.trackingprotection.enabled": false,
      "privacy.trackingprotection.pbmode.enabled": false,
    },
  },

  {
    policies: {
      EnableTrackingProtection: {
        Cryptomining: true,
        Fingerprinting: true,
        Locked: true,
      },
    },
    lockedPrefs: {
      "privacy.trackingprotection.cryptomining.enabled": true,
      "privacy.trackingprotection.fingerprinting.enabled": true,
    },
  },

  // POLICY: OverrideFirstRunPage
  {
    policies: { OverrideFirstRunPage: "https://www.example.com/" },
    lockedPrefs: { "startup.homepage_welcome_url": "https://www.example.com/" },
  },

  // POLICY: Authentication
  {
    policies: {
      Authentication: {
        SPNEGO: ["a.com", "b.com"],
        Delegated: ["a.com", "b.com"],
        NTLM: ["a.com", "b.com"],
        AllowNonFQDN: {
          SPNEGO: true,
          NTLM: true,
        },
        AllowProxies: {
          SPNEGO: false,
          NTLM: false,
        },
        PrivateBrowsing: true,
      },
    },
    lockedPrefs: {
      "network.negotiate-auth.trusted-uris": "a.com, b.com",
      "network.negotiate-auth.delegation-uris": "a.com, b.com",
      "network.automatic-ntlm-auth.trusted-uris": "a.com, b.com",
      "network.automatic-ntlm-auth.allow-non-fqdn": true,
      "network.negotiate-auth.allow-non-fqdn": true,
      "network.automatic-ntlm-auth.allow-proxies": false,
      "network.negotiate-auth.allow-proxies": false,
      "network.auth.private-browsing-sso": true,
    },
  },

  // POLICY: Authentication (unlocked)
  {
    policies: {
      Authentication: {
        SPNEGO: ["a.com", "b.com"],
        Delegated: ["a.com", "b.com"],
        NTLM: ["a.com", "b.com"],
        AllowNonFQDN: {
          SPNEGO: true,
          NTLM: true,
        },
        AllowProxies: {
          SPNEGO: false,
          NTLM: false,
        },
        PrivateBrowsing: true,
        Locked: false,
      },
    },
    unlockedPrefs: {
      "network.negotiate-auth.trusted-uris": "a.com, b.com",
      "network.negotiate-auth.delegation-uris": "a.com, b.com",
      "network.automatic-ntlm-auth.trusted-uris": "a.com, b.com",
      "network.automatic-ntlm-auth.allow-non-fqdn": true,
      "network.negotiate-auth.allow-non-fqdn": true,
      "network.automatic-ntlm-auth.allow-proxies": false,
      "network.negotiate-auth.allow-proxies": false,
      "network.auth.private-browsing-sso": true,
    },
  },

  // POLICY: Certificates (true)
  {
    policies: {
      Certificates: {
        ImportEnterpriseRoots: true,
      },
    },
    lockedPrefs: {
      "security.enterprise_roots.enabled": true,
    },
  },

  // POLICY: Certificates (false)
  {
    policies: {
      Certificates: {
        ImportEnterpriseRoots: false,
      },
    },
    lockedPrefs: {
      "security.enterprise_roots.enabled": false,
    },
  },

  // POLICY: InstallAddons.Default (block addon installs)
  {
    policies: {
      InstallAddonsPermission: {
        Default: false,
      },
    },
    lockedPrefs: {
      "xpinstall.enabled": false,
      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons": false,
      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features": false,
    },
  },

  // POLICY: SanitizeOnShutdown
  {
    policies: {
      SanitizeOnShutdown: true,
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": true,
      "privacy.clearOnShutdown.cookies": true,
      "privacy.clearOnShutdown.downloads": true,
      "privacy.clearOnShutdown.formdata": true,
      "privacy.clearOnShutdown.history": true,
      "privacy.clearOnShutdown.sessions": true,
      "privacy.clearOnShutdown.siteSettings": true,
      "privacy.clearOnShutdown.offlineApps": true,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        Cache: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": true,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        Cookies: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": true,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        Downloads: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": true,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        FormData: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": true,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        History: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": true,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        Sessions: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": true,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        SiteSettings: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
      "privacy.clearOnShutdown.siteSettings": true,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        OfflineApps: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": false,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
      "privacy.clearOnShutdown.offlineApps": true,
    },
  },

  // POLICY: SanitizeOnShutdown using Locked
  {
    policies: {
      SanitizeOnShutdown: {
        Cache: true,
        Locked: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": true,
    },
    unlockedPrefs: {
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        Cache: true,
        Cookies: false,
        Locked: true,
      },
    },
    lockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": true,
      "privacy.clearOnShutdown.cookies": false,
    },
    unlockedPrefs: {
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  {
    policies: {
      SanitizeOnShutdown: {
        Cache: true,
        Locked: false,
      },
    },
    unlockedPrefs: {
      "privacy.sanitize.sanitizeOnShutdown": true,
      "privacy.clearOnShutdown.cache": true,
      "privacy.clearOnShutdown.cookies": false,
      "privacy.clearOnShutdown.downloads": false,
      "privacy.clearOnShutdown.formdata": false,
      "privacy.clearOnShutdown.history": false,
      "privacy.clearOnShutdown.sessions": false,
    },
  },

  // POLICY: DNSOverHTTPS Locked
  {
    policies: {
      DNSOverHTTPS: {
        Enabled: true,
        ProviderURL: "http://example.com/provider",
        ExcludedDomains: ["example.com", "example.org"],
        Locked: true,
      },
    },
    lockedPrefs: {
      "network.trr.mode": 2,
      "network.trr.uri": "http://example.com/provider",
      "network.trr.excluded-domains": "example.com,example.org",
    },
  },

  // POLICY: DNSOverHTTPS Unlocked
  {
    policies: {
      DNSOverHTTPS: {
        Enabled: false,
        ProviderURL: "http://example.com/provider",
        ExcludedDomains: ["example.com", "example.org"],
      },
    },
    unlockedPrefs: {
      "network.trr.mode": 5,
      "network.trr.uri": "http://example.com/provider",
      "network.trr.excluded-domains": "example.com,example.org",
    },
  },

  // POLICY: SSLVersionMin/SSLVersionMax (1)
  {
    policies: {
      SSLVersionMin: "tls1",
      SSLVersionMax: "tls1.1",
    },
    lockedPrefs: {
      "security.tls.version.min": 1,
      "security.tls.version.max": 2,
    },
  },

  // POLICY: SSLVersionMin/SSLVersionMax (2)
  {
    policies: {
      SSLVersionMin: "tls1.2",
      SSLVersionMax: "tls1.3",
    },
    lockedPrefs: {
      "security.tls.version.min": 3,
      "security.tls.version.max": 4,
    },
  },

  // POLICY: CaptivePortal
  {
    policies: {
      CaptivePortal: false,
    },
    lockedPrefs: {
      "network.captive-portal-service.enabled": false,
    },
  },

  // POLICY: NetworkPrediction
  {
    policies: {
      NetworkPrediction: false,
    },
    lockedPrefs: {
      "network.dns.disablePrefetch": true,
      "network.dns.disablePrefetchFromHTTPS": true,
    },
  },

  // POLICY: ExtensionUpdate
  {
    policies: {
      ExtensionUpdate: false,
    },
    lockedPrefs: {
      "extensions.update.enabled": false,
    },
  },

  // POLICY: DisableShield
  {
    policies: {
      DisableFirefoxStudies: true,
    },
    lockedPrefs: {
      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons": false,
      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features": false,
    },
  },

  // POLICY: NewTabPage
  {
    policies: {
      NewTabPage: false,
    },
    lockedPrefs: {
      "browser.newtabpage.enabled": false,
    },
  },

  // POLICY: SearchSuggestEnabled
  {
    policies: {
      SearchSuggestEnabled: false,
    },
    lockedPrefs: {
      "browser.urlbar.suggest.searches": false,
      "browser.search.suggest.enabled": false,
    },
  },

  // POLICY: FirefoxHome
  {
    policies: {
      FirefoxHome: {
        Pocket: false,
        Snippets: false,
        Locked: true,
      },
    },
    lockedPrefs: {
      "browser.newtabpage.activity-stream.feeds.snippets": false,
      "browser.newtabpage.activity-stream.feeds.section.topstories": false,
    },
  },

  // POLICY: OfferToSaveLoginsDefault
  {
    policies: {
      OfferToSaveLoginsDefault: false,
    },
    unlockedPrefs: {
      "signon.rememberSignons": false,
    },
  },

  // POLICY: UserMessaging
  {
    policies: {
      UserMessaging: {
        WhatsNew: false,
        Locked: true,
      },
    },
    lockedPrefs: {
      "browser.messaging-system.whatsNewPanel.enabled": false,
    },
  },

  {
    policies: {
      UserMessaging: {
        ExtensionRecommendations: false,
      },
    },
    unlockedPrefs: {
      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons": false,
    },
  },

  {
    policies: {
      UserMessaging: {
        FeatureRecommendations: false,
      },
    },
    unlockedPrefs: {
      "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features": false,
    },
  },

  // POLICY: Permissions->Autoplay
  {
    policies: {
      Permissions: {
        Autoplay: {
          Default: "allow-audio-video",
          Locked: true,
        },
      },
    },
    lockedPrefs: {
      "media.autoplay.default": 0,
    },
  },

  {
    policies: {
      Permissions: {
        Autoplay: {
          Default: "block-audio",
        },
      },
    },
    unlockedPrefs: {
      "media.autoplay.default": 1,
    },
  },

  {
    policies: {
      Permissions: {
        Autoplay: {
          Default: "block-audio-video",
        },
      },
    },
    unlockedPrefs: {
      "media.autoplay.default": 5,
    },
  },

  // POLICY: LegacySameSiteCookieBehaviorEnabled

  {
    policies: {
      LegacySameSiteCookieBehaviorEnabled: true,
    },
    unlockedPrefs: {
      "network.cookie.sameSite.laxByDefault": false,
    },
  },

  // POLICY: LegacySameSiteCookieBehaviorEnabledForDomainList

  {
    policies: {
      LegacySameSiteCookieBehaviorEnabledForDomainList: [
        "example.com",
        "example.org",
      ],
    },
    unlockedPrefs: {
      "network.cookie.sameSite.laxByDefault.disabledHosts":
        "example.com,example.org",
    },
  },

  // POLICY: EncryptedMediaExtensions

  {
    policies: {
      EncryptedMediaExtensions: {
        Enabled: false,
        Locked: true,
      },
    },
    lockedPrefs: {
      "media.eme.enabled": false,
    },
  },

  // POLICY: PDFjs

  {
    policies: {
      PDFjs: {
        Enabled: false,
        EnablePermissions: true,
      },
    },
    lockedPrefs: {
      "pdfjs.disabled": true,
      "pdfjs.enablePermissions": true,
    },
  },
];

add_task(async function test_policy_simple_prefs() {
  for (let test of POLICIES_TESTS) {
    await setupPolicyEngineWithJson({
      policies: test.policies,
    });

    info("Checking policy: " + Object.keys(test.policies)[0]);

    for (let [prefName, prefValue] of Object.entries(test.lockedPrefs || {})) {
      checkLockedPref(prefName, prefValue);
    }

    for (let [prefName, prefValue] of Object.entries(
      test.unlockedPrefs || {}
    )) {
      checkUnlockedPref(prefName, prefValue);
    }
  }
});
