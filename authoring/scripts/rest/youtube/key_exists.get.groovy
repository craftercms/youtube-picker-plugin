import org.apache.commons.lang3.StringUtils

def result = [:]

def site = request.getParameter("siteId")
if (StringUtils.isEmpty(site)) {
   result.code = 400
   result.message = "Invalid siteId"
   return result
}

def configurationService = applicationContext["configurationService"]
def config = configurationService.legacyGetConfiguration(site, "site-config.xml")

result.exists = config.youtubePicker != null && config.youtubePicker.apiKey != null

return result