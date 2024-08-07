"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            username: values.username,
            password: values.password,
          }
        );

        console.log("Response from server:", response); // Debugging response from server

        if (response.data && response.data.data && response.data.data.token) {
          const { token, vendor_id, user_id, group_user_code, group_users_id } = response.data.data;

          // Set cookies here
          setCookie('token', token.toString(), { secure: true, sameSite: 'none' });
          setCookie('user_id', user_id.toString(), { secure: true, sameSite: 'none' });
          setCookie('vendor_id', vendor_id == null ? "" : vendor_id.toString(), { secure: true, sameSite: 'none' });
          setCookie('group_user_code', group_user_code.toString(), { secure: true, sameSite: 'none' });
          setCookie('group_user_id', group_users_id.toString(), { secure: true, sameSite: 'none' });
          message.success("Login successful!");

          switch (group_user_code) {
            case 'admin':
              router.push('/vendor/registration-list');
              break;
            case 'verifikator':
              router.push('/vendor/verification');
              break;
            case 'ppk':
              router.push('/vendor/registration-list');
              break;
            case 'vendor':
              router.push('/vendor/profile');
              break;
            default:
              router.push('/');
              break;
          }
        } else {
          console.error("Unexpected response from server:", response);
          message.error("An unexpected error occurred. Please try again later.");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data && error.response.data.errors) {
            const backendErrors = error.response.data.errors;
            Object.keys(backendErrors).forEach((key) => {
              message.error(`${backendErrors[key]}`);
            });
          } else {
            message.error(`${error.response?.data.message}`);
            // message.error("An error occurred. Please try again later.");
          }
        } else {
          message.error("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <div className="bg flex h-screen flex-col items-center justify-around bg-gray-100">
        <div>
          <p className="hidden text-center">
            Delapan Pilar Intisolusi ©{new Date().getFullYear()}
          </p>
        </div>
        <div className="w-96 rounded-md bg-white p-5 shadow-md">
          <Form layout="vertical" onFinish={formik.handleSubmit}>
            <p className="pb-5 text-3xl font-semibold">Sign In Delpis e-Proc</p>
            <Form.Item
              label="Username"
              validateStatus={
                formik.errors.username && formik.touched.username ? "error" : ""
              }
              help={
                formik.errors.username && formik.touched.username
                  ? formik.errors.username
                  : ""
              }
            >
              <Input
                id="username"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={
                formik.errors.password && formik.touched.password ? "error" : ""
              }
              help={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ""
              }
            >
              <Input.Password
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                onChange={formik.handleChange}
                checked={formik.values.rememberMe}
              >
                Remember me
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div>
          <p className="text-center">
            Delapan Pilar Intisolusi ©{new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
