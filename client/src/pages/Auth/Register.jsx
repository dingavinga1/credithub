import { Button, Form, Input, Popconfirm, Select, Typography, message } from 'antd'
import Layout from 'antd/es/layout/layout'
import React from 'react'
import { useEth } from '../../contexts/EthContext'
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const { state: { contract, accounts } } = useEth();

    const onAccountChange = (value) => {
        form.setFieldsValue({ walletAccount: value });
    }

    const onFinish = async (values) => {
        try{
            await contract.methods.register(values.password, values.income).send({ from: values.walletAccount, value: 1000000000000000000 });
            message.success("Registration successful");
            navigate('/login');
        } catch(err){
            message.destroy();
            message.error(err.message);
        }
    }


  return (
    <Layout style={{ minHeight: "100vh", padding: "2vh" }}>
      <Title>Register</Title>
      <Form onFinish={onFinish} form={form} style={{ marginBottom: '1vh' }}>
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

        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>

        <Form.Item
          label="Monthly Income"
          name="income"
          rules={[
            {
              required: true,
              message: "Please input your monthly income!",
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Popconfirm
            title="Are you sure you want to register? Please not that a 1 ether fee will be deducted from your wallet!"
            onConfirm={form.submit}
            okText="Yes"
            cancelText="No"
        >
          <Button type="primary">
            Register
          </Button>
        </Popconfirm>
      </Form>

      <Link style={{ textAlign: 'center' }} to="/login">Already have an account? Login here</Link>
    </Layout>
  );
}
export default Register