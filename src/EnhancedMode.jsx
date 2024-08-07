import { ActionPanel, Color, Icon, List, ToastStyle, popToRoot, showToast } from "@raycast/api"
import api from "./api"

/**
 * @param {Object} props
 * @param {string} props.xKey
 * @param {string} props.port
 * @param {boolean} props.isEnhancedModeEnabled
 * @returns {React.ReactElement}
 */
export default function EnhancedMode({ xKey, port, isEnhancedModeEnabled }) {
  const iconCheckMark = { source: Icon.Checkmark, tintColor: Color.Green }
  const iconExclamationMark = { source: Icon.ExclamationMark, tintColor: Color.Yellow }
  const iconTransparent = { source: "Transparent.png" }
  const iconListItem = isEnhancedModeEnabled ? iconCheckMark : iconExclamationMark

  /**
   * Change Enhanced Mode.
   * @param {boolean} mode - pending Enhanced Mode.
   */
  async function handleAction(mode) {
    try {
      await api(xKey, port).changeEnhancedMode(mode)
      await showToast(
        ToastStyle.Success,
        "成功",
        `增强模式 ${mode === true ? "开启" : "关闭"}.`
      )
      popToRoot({ clearSearchBar: true })
    } catch (err) {
      await showToast(ToastStyle.Failure, "失败", "请检查 X-Key, port and function 可用性")
    }
  }

  return (
    <List.Item
      title="增强模式"
      icon={iconListItem}
      subtitle={isEnhancedModeEnabled ? "开启" : "关闭"}
      actions={
        <ActionPanel title="增强模式">
          <ActionPanel.Item
            title={isEnhancedModeEnabled ? "关闭增强模式" : "开启增强模式"}
            icon={isEnhancedModeEnabled ? iconCheckMark : iconTransparent}
            onAction={() => handleAction(!isEnhancedModeEnabled)}
          />
        </ActionPanel>
      }
    />
  )
  // return (
  //   <List.Item
  //     title="增强模式"
  //     icon={iconListItem}
  //     actions={
  //       <ActionPanel title="增强模式">
  //         <ActionPanel.Submenu title="增强模式">
  //           <ActionPanel.Item
  //             title="开启"
  //             icon={isEnhancedModeEnabled ? iconCheckMark : iconTransparent}
  //             onAction={() => handleAction(true)}
  //           />
  //           <ActionPanel.Item
  //             title="关闭"
  //             icon={!isEnhancedModeEnabled ? iconCheckMark : iconTransparent}
  //             onAction={() => handleAction(false)}
  //           />
  //         </ActionPanel.Submenu>
  //       </ActionPanel>
  //     }
  //   />
  // )
}
