import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import Message from "../components/Message";

const NotFoundAdminScreen = () => {
  const editorRef = useRef(null);
  const [isTextSet, setIsTextSet] = useState(null);
  const [initialText, setInitialText] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get("/api/admin/notfoundredactor");
      setInitialText(data[0].text);
    }
    fetch()
  }, []);

  const log = async () => {
    if (editorRef.current) {
      const { data } = await axios.post("/api/admin/notfoundredactor", {
        text: editorRef.current.getContent(),
      });
      setIsTextSet(data === "OK");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Редактировать страницу 404</h1>
      {isTextSet === true ? (
        <Message variant="success">Страница 404 изменена</Message>
      ) : isTextSet === false ? (
        <Message variant="danger">Произошла ошибка</Message>
      ) : (
        <></>
      )}
      <Editor
        apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={initialText}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={log} style={{ width: "fit-content", margin: "auto" }}>
        Установить контент страницы 404
      </button>
    </div>
  );
};

export default NotFoundAdminScreen;
