import axios from "axios";
import { userlocalStorageData } from "./localStorage";
export const makeApi = async (req, url, body) => {

    const userData = userlocalStorageData();
    const getToken = userData ? userData.token : null;

    const previousUrl = "http://192.168.0.202:8000"
    var config = {
        method: req,
        url: previousUrl + url,
        data: body,
        headers: {
            Authorization: `Bearer ${getToken}`
        }
    };
    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}