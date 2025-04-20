import { useEffect, useState } from "react";
import { UseUser } from "../context/MainContext";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { setUser } = UseUser();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.clear();
    setUser(null);
    return navigate("/login");
  }

  //for creating project
  async function createProject(e) {
    e.preventDefault();

    try {
      const response = await axios.post("/project/create", {
        projectName,
      });
      console.log(response);

      setProjectName("");
      setOpenModal(false);
    } catch (error) {
      console.log(error.response.data);
      setOpenModal(false);
    }
  }

  //for loading projects when page loads
  useEffect(() => {
    async function getAllProjects() {
      try {
        const response = await axios.get("/project/all");
        setProjects(response.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getAllProjects();
  }, []);

  //handleSingleProjectClick

  function handleSingleProjectClick(singleProject) {
    navigate("/project", {
      state: singleProject,
    });
  }

  return (
    <main className="p-6 relative min-h-screen bg-gradient-to-r from-slate-500 to-slate-800">
      <div className=" projects flex flex-wrap gap-3">
        <button
          onClick={() => setOpenModal(true)}
          className="hover:bg-slate-200 cursor-pointer project p-4 border border-slate-300 rounded-md"
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {projects.map((singleProject) => {
          return (
            <div
              key={singleProject._id}
              className="project bg-slate-200 flex flex-col gap-2 cursor-pointer p-4 border border-slate-200 rounded-md min-w-52 hover:bg-slate-200"
              onClick={() => handleSingleProjectClick(singleProject)}
            >
              <h2 className="font-semibold">{singleProject.projectName}</h2>

              <div className="flex gap-2">
                <p>
                  {" "}
                  <small>
                    {" "}
                    <i className="ri-user-line"></i> Collaborators
                  </small>{" "}
                  :
                </p>
                {singleProject.users.length}
              </div>
            </div>
          );
        })}
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600/50 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  value={projectName}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setOpenModal(false)}
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="p-5 font-medium text-xl text-white bg-red-700 rounded-2xl absolute top-7 right-7"
      >
        Logout
      </button>
    </main>
  );
};

export default Home;
