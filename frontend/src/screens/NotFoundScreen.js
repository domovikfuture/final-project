import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const NotFoundScreen = () => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const init = async () => {
      const data = await fetch(window.location.href);
      const resHtml = await data.text()

      if (resHtml.startsWith('<!doctype html>') && window.location.pathname !== "/404") {
        window.location.href = "/404"
      }
      setHtml(resHtml);
    };
    init();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default NotFoundScreen;
