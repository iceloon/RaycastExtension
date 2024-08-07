import { ActionPanel, Color, Icon, List, ToastStyle, showToast } from "@raycast/api";
import api from "./api";
import React, { useState, useEffect } from "react";

/**
 * @param {Object} props
 * @param {string} props.xKey
 * @param {string} props.port
 * @param {boolean} props.isEnabled
 * @returns {React.ReactElement}
 */
export default function SystemProxyAndEnhancedMode({ xKey, port, isEnabled: initialIsEnabled }) {
  const [isEnabled, setIsEnabled] = useState(initialIsEnabled);

  const iconCheckMark = { source: Icon.Checkmark, tintColor: Color.Green };
  const iconExclamationMark = { source: Icon.ExclamationMark, tintColor: Color.Yellow };
  const iconTransparent = { source: "Transparent.png" };
  const iconListItem = isEnabled ? iconCheckMark : iconExclamationMark;

  useEffect(() => {
    setIsEnabled(initialIsEnabled);
  }, [initialIsEnabled]);

  /**
   * Change System Proxy and Enhanced Mode status.
   * @param {boolean} mode - pending status.
   */
  async function handleAction(mode) {
    try {
      await api(xKey, port).changeSystemProxyStatus(mode);
      await api(xKey, port).changeEnhancedMode(mode);
      setIsEnabled(mode);
      await showToast(ToastStyle.Success, "成功", `系统代理和增强模式 ${mode ? "开启" : "关闭"}.`);
    } catch (err) {
      await showToast(ToastStyle.Failure, "失败", "请检查 X-Key, port 和功能可用性");
    }
  }

  return (
    <List.Item
      title="系统代理和增强模式"
      icon={iconListItem}
      subtitle={isEnabled ? "开启" : "关闭"}
      actions={
        <ActionPanel title="系统代理和增强模式">
          <ActionPanel.Item
            title={isEnabled ? "关闭系统代理和增强模式" : "开启系统代理和增强模式"}
            icon={isEnabled ? iconCheckMark : iconTransparent}
            onAction={() => handleAction(!isEnabled)}
          />
        </ActionPanel>
      }
    />
  );
}