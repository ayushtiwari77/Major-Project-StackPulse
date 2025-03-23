/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initailizeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UseUser } from "../context/MainContext";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import { getWebContainer } from "../config/webContainer";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const uniquePrefix = Math.random().toString(36).substring(7);
  const [project, setProject] = useState(location.state);
  const [messages, setMessages] = useState("");
  const { user: currentUser } = UseUser();
  const messageBoxRef = React.useRef(null);

  const [messageArr, setMessageArr] = useState([]);
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  //add collborators modal select users
  function handleClick(id) {
    setSelectedUserIds((prevSetIds) => {
      const newSelectedUserIds = new Set(prevSetIds);

      if (newSelectedUserIds.has(id)) {
        newSelectedUserIds.delete(id);
      } else {
        newSelectedUserIds.add(id);
      }

      return newSelectedUserIds;
    });
  }

  //add collaborators function
  function addCollaborators() {
    axios
      .put("/project/add-user", {
        projectId: project._id,
        users: Array.from(selectedUserIds),
      })
      .then(() => {
        setIsModalOpen(false);
      })
      .catch((err) => console.log(err));
  }

  //send message functionality
  function send() {
    if (messages) {
      sendMessage("project-message", {
        messages,
        sender: currentUser,
      });
      setMessageArr((prevMessages) => [
        ...prevMessages,
        { sender: currentUser, messages },
      ]);
      //appendOutgoingMessage(messages);
      setMessages("");
    }
  }

  function writeAiMessage(message) {
    const messageObject = JSON.parse(message);

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  // function appendIncomingMessage(messageObject) {
  //   const messageBox = document.querySelector(".message-box");
  //   const message = document.createElement("div");
  //   message.classList.add(
  //     "max-w-52",
  //     "flex",
  //     "flex-col",
  //     "p-2",
  //     "bg-slate-50",
  //     "w-fit",
  //     "rounded-md"
  //   );
  //   message.innerHTML = `
  //   <small className="opacity-65 text-xs">${messageObject.sender.user.email}</small>
  //    <p className="text-sm">${messageObject.messages}</p>

  //   `;

  //   messageBox.appendChild(message);
  //   scrollToTop();
  // }

  // function appendOutgoingMessage(messageObject) {
  //   const messageBox = document.querySelector(".message-box");
  //   const message = document.createElement("div");
  //   message.classList.add(
  //     "max-w-52",
  //     "ml-auto",
  //     "flex",
  //     "flex-col",
  //     "p-2",
  //     "bg-yellow-200",
  //     "w-fit",
  //     "rounded-md"
  //   );
  //   message.innerHTML = `
  //   <small className="opacity-65 text-xs">${currentUser.user.email}</small>
  //    <p className="text-sm">${messageObject}</p>

  //   `;
  //   messageBox.appendChild(message);
  //   scrollToTop();
  // }

  //

  useEffect(() => {
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container started");
      });
    }

    //starting socket connection on opening a project
    initailizeSocket(project._id);

    //recieve message
    receiveMessage("project-message", (data) => {
      // appendIncomingMessage(data);

      if (data.sender.user._id == "ai") {
        const message = JSON.parse(data.messages);
        console.log(message);

        webContainer?.mount(message.fileTree);

        if (message.fileTree) {
          setFileTree(message.fileTree || {});
          saveFileTree(message.fileTree || {});
        }
        setMessageArr((prevMessages) => [...prevMessages, data]);
      } else {
        setMessageArr((prevMessages) => [...prevMessages, data]);
      }
    });

    //fetching project details and setting it int setProject
    axios
      .get(`/project/get-project/${location.state._id}`)
      .then((res) => {
        console.log(res.data);
        setProject(res.data);
        setFileTree(res.data.fileTree);
      })
      .catch((err) => console.log(err));

    //fetching all users
    axios
      .get("/user/all")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function scrollToTop() {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToTop();
  }, [messageArr]);

  function saveFileTree(ft) {
    console.log("save hogya");
    axios
      .put("/project/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
          <button onClick={() => setIsModalOpen(true)} className="flex gap-2">
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button
            className="p-2 cursor-pointer"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBoxRef}
            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
          >
            {messageArr.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    msg.sender.user.email === "AI" ? "max-w-80" : "max-w-52"
                  } ${
                    msg.sender.user.email == currentUser.user.email &&
                    "ml-auto bg-yellow-200"
                  }  flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
                >
                  <small className="opacity-65 text-xs">
                    {msg.sender.user.email}
                  </small>
                  <div className="text-sm ">
                    {msg.sender.user._id === "ai" ? (
                      writeAiMessage(msg.messages)
                    ) : (
                      <p className="break-words">{msg.messages}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {/*
 //left waala message saamen waale kaa hota hai
            <div className="max-w-52 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">email dalega yha par</small>
              <div className="text-sm">
                <p>{"message ayega yha pe"}</p>
              </div>
            </div>
            //right waala message
            <div className="ml-auto max-w-52 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-xs">email dalega yha par</small>
              <div className="text-sm">
                <p>{"message ayega yha pe"}</p>
              </div>
            </div>

*/}
          </div>

          <div className="inputField w-full flex absolute bottom-0">
            <input
              onChange={(e) => setMessages(e.target.value)}
              value={messages}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 z-30  bg-slate-50 absolute  transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-4 p-2  bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>

            <button
              onClick={() => setIsSidePanelOpen(false)}
              className="p-2 cursor-pointer"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2">
            {project.users.map((singleUser, ind) => {
              return (
                <div
                  key={`${uniquePrefix}-${ind}`}
                  className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center"
                >
                  <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{singleUser.email}</h1>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ************************************************ */}

      <section className="right  bg-red-50 flex-grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
          <div className="file-tree w-full">
            {fileTree &&
              Object.keys(fileTree).length > 0 &&
              Object.keys(fileTree).map((file, index) => (
                <button
                  onClick={() => {
                    setCurrentFile(file);
                    setOpenFiles([...new Set([...openFiles, file])]);
                  }}
                  key={index}
                  className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
                >
                  <p className="font-semibold text-lg">{file}</p>
                </button>
              ))}
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full shrink">
          <div className="top flex justify-between w-full">
            <div className="files flex">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 `}
                >
                  <p className="font-semibold text-lg">{file}</p>
                </button>
              ))}
            </div>

            <div className="actions flex gap-2">
              <button
                onClick={async () => {
                  await webContainer.mount(fileTree);

                  const installProcess = await webContainer.spawn("npm", [
                    "install",
                  ]);
                  const installWriter = new WritableStream({
                    write(chunk) {
                      console.log("Install output:", chunk);
                    },
                  });

                  installProcess.output.pipeTo(
                    // new WritableStream({
                    //   write(chunk) {
                    //     console.log(chunk);
                    //   },
                    // })
                    installWriter
                  );

                  if (runProcess) {
                    runProcess.kill();
                  }

                  let tempRunProcess = await webContainer.spawn("npm", [
                    "start",
                  ]);

                  const runWriter = new WritableStream({
                    write(chunk) {
                      console.log("Run output", chunk);
                    },
                  });

                  tempRunProcess.output.pipeTo(
                    // new WritableStream({
                    //   write(chunk) {
                    //     console.log(chunk);
                    //   },
                    // })
                    runWriter
                  );

                  setRunProcess(tempRunProcess);

                  webContainer.on("server-ready", (port, url) => {
                    console.log(port, url);
                    setIframeUrl(url);
                  });
                }}
                className="p-2 px-4 bg-slate-300 text-black font-bold"
              >
                run
              </button>
            </div>
          </div>
          <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
            {fileTree && currentFile && fileTree[currentFile] && (
              <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent,
                          },
                        },
                      };
                      console.log("save hogya");
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        "javascript",
                        fileTree[currentFile].file.contents
                      ).value,
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>

        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input
                type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-4 bg-slate-200"
              />
            </div>
            <iframe src={iframeUrl} className="w-full h-full"></iframe>
          </div>
        )}
      </section>

      {/* ************************************************ */}

      {/* yeh hai vo code jha pe add collaborators waala model show hoga */}
      {isModalOpen && (
        <div className="fixed z-20 inset-0 bg-gray-600/50  bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUserIds(new Set());
                }}
                className="p-2"
              >
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {
                users.map((eachUser) => {
                  return (
                    <div
                      key={eachUser._id}
                      onClick={() => handleClick(eachUser._id)}
                      className={`user cursor-pointer flex justify-start gap-6 hover:bg-slate-200 
                        ${
                          Array.from(selectedUserIds).indexOf(eachUser._id) !==
                          -1
                            ? "bg-slate-200 "
                            : ""
                        }
                        `}
                    >
                      <div className="aspect-square  relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                        <i className="ri-user-fill absolute"></i>
                      </div>
                      <h1 className="font-semibold text-lg">
                        {eachUser.email}
                      </h1>
                    </div>
                  );
                })
                //single user hai
              }
            </div>

            <button
              onClick={addCollaborators}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
