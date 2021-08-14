import React from "react";
import "./styles.css";
import Form from "./Form";
import formData from "./config-emtss2.json";
// import { formData } from './formData'

export default function App() {
  return (
    <div className="App">
      <Form formData={formData} />
    </div>
  );
}