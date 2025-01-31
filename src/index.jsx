import { useEffect, useState } from "react"
import { Detail, List, ToastStyle, getPreferenceValues, showToast } from "@raycast/api"
import api from "./api"

import CapabilitiesActions from "./CapabilitiesActions"
import EnhancedMode from "./EnhancedMode"
import FlushDNS from "./FlushDNS"
import OutboundModeActions from "./OutboundModeActions"
import ProxyPolicies from "./ProxyPolicies"
import ReloadProfile from "./ReloadProfile"
import SetAsSystemProxy from "./SetAsSystemProxy"
import SwitchProfile from "./SwitchProfile"
import SystemProxyAndEnhancedMode from "./SystemProxyAndEnhancedMode"

export default function Command() {
  // https://developers.raycast.com/api-reference/preferences#getpreferencevalues
  // Get values of the preferences object.
  const preferences = getPreferenceValues()
  const [xKey] = useState(preferences["x-key"])
  const [port] = useState(preferences.port)

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [isMacOSVersion, setIsMacOSVersion] = useState(false)
  const [currentOutboundMode, setCurrentOutboundMode] = useState("")
  const [currentProfile, setCurrentProfile] = useState("")
  const [isSystemProxyEnabled, setSystemProxyStatus] = useState(false)
  const [isEnhancedModeEnabled, setEnhancedModeStatus] = useState(false)
  const [isEnabled, setStatus] = useState(false)
  const [isHttpCaptureEnabled, setHttpCaptureStatus] = useState(false)
  const [isMitmEnabled, setMitmStatus] = useState(false)
  const [isRewriteEnabled, setRewriteStatus] = useState(false)
  const [isScriptingEnabled, setScriptingStatus] = useState(false)
  const [allPolicyGroups, setAllPolicyGroups] = useState({})
  const [allSelectOptions, setAllSelectOptions] = useState([])
  const [allProfiles, setAllProfiles] = useState([])

  async function fetchData() {
    try {
      const isMacOSVersion = await api(xKey, port).isMacOSVersion()

      const [
        currentOutboundMode,
        currentSystemProxyStatus,
        currentEnhancedMode,
        currentHttpCaptureStatus,
        currentMitmStatus,
        currentRewriteStatus,
        currentScriptingStatus,
        allPolicyGroups,
        currentProfile,
        allProfiles
      ] = await Promise.all([
        api(xKey, port).getOutboundMode(),
        isMacOSVersion ? api(xKey, port).getSystemProxyStatus() : Promise.resolve({ data: { enabled: false } }),
        isMacOSVersion ? api(xKey, port).getEnhancedMode() : Promise.resolve({ data: { enabled: false } }),
        api(xKey, port).getHttpCaptureStatus(),
        api(xKey, port).getMitmStatus(),
        api(xKey, port).getRewriteStatus(),
        api(xKey, port).getScriptingStatus(),
        api(xKey, port).getPolicyGroups(),
        api(xKey, port).getProfile(),
        isMacOSVersion ? api(xKey, port).getProfiles() : Promise.resolve({ data: { profiles: [] } })
        // ...
      ])

      const allSelectOptions = await Promise.all(
        Object.entries(allPolicyGroups.data).map(async ([name]) => {
          const { data } = await api(xKey, port).getSelectOptionFromPolicyGroup(name)
          return data.policy
        })
      )

      setIsMacOSVersion(isMacOSVersion)
      setCurrentOutboundMode(currentOutboundMode.data.mode)
      setCurrentProfile(currentProfile.data.name)
      setSystemProxyStatus(currentSystemProxyStatus.data.enabled)
      setEnhancedModeStatus(currentEnhancedMode.data.enabled)
      setStatus(currentEnhancedMode.data.enabled)
      setHttpCaptureStatus(currentHttpCaptureStatus.data.enabled)
      setMitmStatus(currentMitmStatus.data.enabled)
      setRewriteStatus(currentRewriteStatus.data.enabled)
      setScriptingStatus(currentScriptingStatus.data.enabled)
      setAllPolicyGroups(allPolicyGroups.data)
      setAllSelectOptions(allSelectOptions)
      setAllProfiles(allProfiles.data.profiles)
    } catch (err) {
      setIsError(true)

      await showToast(
        ToastStyle.Failure,
        "失败",
        "请检查 Surge version, X-Key, port and HTTP API function 可用性"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return <List isLoading />
  } else if (isError) {
    return <Detail markdown="No results" />
  } else {
    return (
      <List>
        {/*{isMacOSVersion && <SetAsSystemProxy xKey={xKey} port={port} isSystemProxyEnabled={isSystemProxyEnabled} />}

        {isMacOSVersion && <EnhancedMode xKey={xKey} port={port} isEnhancedModeEnabled={isEnhancedModeEnabled} />}*/}
       
        {isMacOSVersion && <SystemProxyAndEnhancedMode xKey={xKey} port={port} isEnabled={isEnabled}  />}

        <OutboundModeActions xKey={xKey} port={port} currentOutboundMode={currentOutboundMode} />

        

        {/*{Object.keys(allPolicyGroups).length > 0 ? (
          <ProxyPolicies
            xKey={xKey}
            port={port}
            allPolicyGroups={allPolicyGroups}
            allSelectOptions={allSelectOptions}
          />
        ) : null}

        <CapabilitiesActions
          xKey={xKey}
          port={port}
          isHttpCaptureEnabled={isHttpCaptureEnabled}
          isMitmEnabled={isMitmEnabled}
          isRewriteEnabled={isRewriteEnabled}
          isScriptingEnabled={isScriptingEnabled}
        />

        {allProfiles.length > 0 ? (
          <>
            <SwitchProfile xKey={xKey} port={port} allProfiles={allProfiles} currentProfile={currentProfile} />
            <ReloadProfile xKey={xKey} port={port} />
          </>
        ) : null}

        <FlushDNS xKey={xKey} port={port} />*/}
      </List>
    )
  }
}
