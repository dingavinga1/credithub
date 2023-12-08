import {
  Row,
  Card,
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Typography,
  message,
} from "antd";
import Layout from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { Link, useNavigate } from "react-router-dom";
import Web3 from "web3";

const { Title } = Typography;

const Withdraw = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const {
    state: { contract },
  } = useEth();

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    let accountId = localStorage.getItem("publicKey");
    let password = localStorage.getItem("password");

    if (contract) {
      const getDetails = async () => {
        try {
          const details = await contract.methods
            .getUserBalance()
            .call({ from: accountId });
        
          const inWei = Web3.utils.toWei(details, "ether");

          setBalance(inWei);
        } catch (err) {
          message.destroy();
          message.error(err.message);
        }
      };

      getDetails();
    }
  }, [contract])


  const onFinish = async (values) => {
    try {
      const account = localStorage.getItem("publicKey");
      const password = localStorage.getItem("password");
      await contract.methods
        .withdraw(values.amount, password)
        .send({ from: account });
      message.success("Deposit successful!");
      navigate("/profile");
    } catch (err) {
      message.destroy();
      message.error(err.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: "2vh" }}>
      <Title>Withdraw</Title>
      <Card>
        <Title level={5}>Balance: {balance??"0"} Wei</Title>

        <Form onFinish={onFinish} form={form} style={{ marginTop: '2vh' }}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please enter an amount!",
              },
              {
                //check for exceeding max
                validator: async (_, value) => {
                  if (value > balance) {
                    return Promise.reject(
                      new Error("Amount exceeds balance!")
                    );
                  }
                },
              }
            ]}
          >
            <Input type="number" min={0} max={balance??0} />
          </Form.Item>

          <Popconfirm
            title={`Are you sure you want to deposit ${form.values?.amount}?`}
            onConfirm={form.submit}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Withdraw</Button>
          </Popconfirm>
        </Form>
      </Card>
    </Layout>
  );
};
export default Withdraw;
