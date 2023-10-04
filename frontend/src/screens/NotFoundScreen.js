import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const NotFoundScreen = () => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const init = async () => {
      const data = await fetch(window.location.href);
      const resHtml = await data.text()
      console.log(resHtml)
      setHtml(resHtml);
    };
    init();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default NotFoundScreen;
