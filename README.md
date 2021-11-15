# YouTube Plugin for Crafter CMS

This is a plugin to add YouTube videos to your site.

# Installation

The plugin can be installed to your site from the Crafter CMS Marketplace

# Setup

After the plugin has been installed you need to setup your Google API Key in the content-type

# Usage

Once the Google API Key is properly configured you can create any number of YouTube components as needed.

# Build UI

* Go to `src/js`, update `main.js`

* Run following commands:

```
yarn
yarn build
```

* New build is updated to `authoring/js/control/youtube/main.js`

# Configure server

Update studio blacklist:

```
# method java.net.URL openConnection
…
# staticMethod org.codehaus.groovy.runtime.DefaultGroovyMethods getAt java.lang.Object java.lang.String
```

Update studio-config.yaml:

```
# Indicates if access to beans should be restricted
studio.scripting.restrictBeans: false
# List of patterns for bean names that should be accessible for the scripts (regexes separated by commas)
studio.scripting.allowedBeans: 'crafter.textEncryptor'
```

# Add Google API key

Refer to [add_google_api_key.pdf](add_google_api_key.pdf)