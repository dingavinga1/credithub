import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";
import Layout from "antd/es/layout/layout";
import React, { useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const {
    state: { accounts },
  } = useEth();

  const onAccountChange = (value) => {
    form.setFieldsValue({ walletAccount: value });
  };

  const onFinish = async (values) => {
    try{
        localStorage.setItem('publicKey', values.walletAccount);
        localStorage.setItem('password', values.password);

        message.success("Login successful!");

        navigate('/');
    } catch(err){
        message.destroy();
        message.error(err.message);
    }
  };
  
  return (
    <Layout style={{ minHeight: "100vh", padding: "2vh" }}>
      <Title>Login</Title>
      <Form onFinish={onFinish} form={form} style={{ marginBottom: "1vh" }}>
        <Form.Item
          label="Wallet Account"
          name="walletAccount"
          rules={[
            {
              required: true,
              message: "Please select a wallet address",
            },
          ]}
        >
          <Select
            mode="single"
            placeholder="Select wallet account"
            onChange={onAccountChange}
            style={{ width: "100%" }}
            options={accounts?.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>


        <Button type="primary" htmlType="submit">Login</Button>
      </Form>

      <Link style={{ textAlign: "center" }} to="/register">
        Don't have an account? Register here
      </Link>
    </Layout>
  );
};
export default Login;
