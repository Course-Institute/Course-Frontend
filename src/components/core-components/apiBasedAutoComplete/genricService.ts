import axiosInstance from "../../../api/axiosInstance";

const getAutoCompleteList = async (path: string, method: string = "POST", payload: any) => {
    try {
        if(method === 'GET') {
          const { data } = await axiosInstance.get(path, {params: {...payload}});
          return data;
        }
        else {
          const { data } = await axiosInstance.post(path, payload);
          return data;
        }
    } catch (error) {
      console.error('Error Fetching list:', error);
    }
  };

export {
    getAutoCompleteList
}