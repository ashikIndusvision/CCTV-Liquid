import axiosInstance from "../../../API/Api";

interface LoginData {
    username: string;
    password: string;
}

interface ApiResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export const loginApi = async (data: LoginData): Promise<ApiResponse> => {
    try {
        const response: ApiResponse = await axiosInstance.post("login/", data);
        return response;
    } catch (error) {
        console.log(error, "Error During Login");
        throw error;
    }
}