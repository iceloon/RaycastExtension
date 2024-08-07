import { ActionPanel, Color, Icon, List, ToastStyle, popToRoot, showToast } from "@raycast/api"
import api from "./api"

/**
 * @param {Object} props
 * @param {string} props.xKey
 * @param {string} props.port
 * @param {boolean} props.isSystemProxyEnabled
 * @returns {React.ReactElement}
 */
export default function SetAsSystemProxy({ xKey, port, isSystemProxyEnabled }) {
  const iconCheckMark = { source: Icon.Checkmark, tintColor: Color.Green }
  const iconExclamationMark = { source: Icon.ExclamationMark, tintColor: Color.Yellow }
  const iconTransparent = { source: "Transparent.png" }
  const iconListItem = isSystemProxyEnabled ? iconCheckMark : iconExclamationMark

  /**
   * Change System Proxy status.
   * @param {boolean} mode - pending system proxy status.
   */
  async function handleAction(mode) {
    try {
      await api(xKey, port).changeSystemProxyStatus(mode)
      await showToast(ToastStyle.Success, "成功", `系统代理 ${mode === true ? "开启" : "关闭"}.`)
      popToRoot({ clearSearchBar: true })
    } catch (err) {
      await showToast(ToastStyle.Failure, "失败", "请检查 X-Key, port and function 可用性")
    }
  }

  return (
    <List.Item
      title="系统代理"
      icon={iconListItem}
      subtitle={isSystemProxyEnabled ? "开启" : "关闭"}
      actions={
        <ActionPanel title="系统代理">
          <ActionPanel.Item
            title={isSystemProxyEnabled ? "关闭系统代理" : "开启系统代理"}
            icon={isSystemProxyEnabled ? iconCheckMark : iconTransparent}
            onAction={() => handleAction(!isSystemProxyEnabled)}
          />
        </ActionPanel>
      }
    />

  )

  // return (
  //   <List.Item
  //     title="系统代理"
  //     icon={iconListItem}
  //     actions={
  //       <ActionPanel title="系统代理">
  //         <ActionPanel.Submenu title="系统代理">
  //           <ActionPanel.Item
  //             title="开启"
  //             icon={isSystemProxyEnabled ? iconCheckMark : iconTransparent}
  //             onAction={() => handleAction(true)}
  //           />
  //           <ActionPanel.Item
  //             title="关闭"
  //             icon={!isSystemProxyEnabled ? iconCheckMark : iconTransparent}
  //             onAction={() => handleAction(false)}
  //           />
  //         </ActionPanel.Submenu>
  //       </ActionPanel>
  //     }
  //   />

  // )
}
