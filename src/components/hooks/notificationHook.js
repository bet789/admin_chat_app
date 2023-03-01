import React from "react";
import { notification } from "antd";

export default function notificationHook({ type, message, description }) {
  //   return notification.error({
  //     message: message,
  //     description: description,
  //   });

  return type === "error"
    ? notification.error({
        message: message,
        description: description,
      })
    : type === "success"
    ? notification.success({
        message: message,
        description: description,
      })
    : type === "warning"
    ? notification.warning({
        message: message,
        description: description,
      })
    : type === "info"
    ? notification.info({
        message: message,
        description: description,
      })
    : notification.open({
        message: message,
        description: description,
      });
}
