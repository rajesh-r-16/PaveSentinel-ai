import api from "./api";


export const detectPothole = async (file) => {

    const formData = new FormData();

    formData.append(
        "image",
        file
    );


    console.log(
        "Sending image to AI backend:",
        file.name
    );


    const response = await api.post(
        "/ai/detect",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );


    console.log(
        "AI Backend Response:",
        response.data
    );


    return response.data;

};