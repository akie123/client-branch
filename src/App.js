
import { BrowserRouter ,Routes ,Route}   from "react-router-dom";

import Client from "./pages/client"
import Signin from "./pages/signin"
function App() {
  return (

    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Signin/>} />
        <Route path="/agent" element={<Client/>} />
    </Routes>
    </BrowserRouter>


  );
}

export default App;
