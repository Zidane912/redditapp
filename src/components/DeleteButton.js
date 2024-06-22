import React from "react";
import axios from "axios";

const DeleteButton = ({ deletePost }) => {
    
    // const onClick = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //       const response = await axios.post("http://127.0.0.1:5000/delete", {
    //         id
    //       });
    //       if (response.status === 201) {

    //       }
    //     } catch (error) {
    //       console.error("Error posting data:", error);
    //     }
    //   };

      return (
        <div>
            <button>
                <i className="fa-solid fa-trash fa-fw delete-button"></i>
            </button>
        </div>
      )


}

export default DeleteButton;