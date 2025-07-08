import axios from "axios";

const service = axios.create({
  baseURL: window.BaseUrl,
  timeout: 300000
});

// http request 拦截器
service.interceptors.request.use(
  config => {
   if(config.url.indexOf('http://')>-1){
     config.baseURL = ''
   } else {
     if(config.method === 'post'){
      if(localStorage.getItem('user')){
        // config.data['orgId'] = encodeURI(JSON.parse(localStorage.getItem('user')).orgid)
      }else{
        // config.data['orgId'] = '00000000-0000-0000-0000-000000000000'
      }
     }
   } 
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.data.code;
    if (code === "500") {
      console.log(500);
    }
    return response;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

const request = options => {
  return new Promise((resolve, reject) => {
    service(options)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default request;
