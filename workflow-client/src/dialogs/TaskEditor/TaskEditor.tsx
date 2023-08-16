import React from "react";

import { OnSubmitType } from "@/types/general/utils";

import { AxiosResponse } from "axios";
import { Form, Field, useFormik, FormikProvider } from "formik";

import useAuthClient from "@/hooks/useClient";

import Button from "@/components/general/Button/Button";
import { TextField, TextAreaField } from "@/components/general/TextInput";
import UserSelect from "@/components/general/UserSelect/UserSelect";

import User from "@/components/board/User/User";

import "./TaskEditor.scss";

import { validationSchema } from "./formSchema";

type TaskEditorProps = {
  boardId: string;
  columnId?: string;
  onSubmit?: (data: any) => void;
  initialValues?: {
    title?: string;
    description?: string;
    assignees?: { label: string; value: string }[];
    tags?: string[];
  };
};

const TaskEditorForm: React.FC<TaskEditorProps> = ({
  boardId,
  columnId,
  initialValues,
  onSubmit,
}) => {
  const INITIAL_FORM_VALUES = {
    title: initialValues?.title || "",
    description: initialValues?.title || "",
    assignees: initialValues?.assignees || [],
  };

  const client = useAuthClient();

  const onSubmitHandler: OnSubmitType<any> = async (values) => {
    const { assignees, ...payload } = values;
    payload.assignees = assignees?.map((it: any) => it.value);
    payload.columnId = columnId;
    onSubmit?.(payload);
  };

  const formik = useFormik({
    initialValues: INITIAL_FORM_VALUES,
    validationSchema: validationSchema,
    onSubmit: onSubmitHandler,
  });

  const loadMembers = async (searchTerm: string) =>
    client.get(`/boards/${boardId}/members`, {
      params: { limit: 5, page: 1, username: searchTerm },
    });

  const transformData = (response: AxiosResponse) => {
    return response.data?.members?.map((user: any) => ({
      value: user?.user?._id,
      label: user?.user?.username,
    }));
  };

  return (
    <FormikProvider value={formik}>
      <Form>
        <section className="task-editor">
          <div>
            <Field
              name="title"
              autoFocus={true}
              error={formik.touched.title && formik.errors.title}
              as={TextField}
            />
            <Field
              name="description"
              error={formik.touched.description && formik.errors.description}
              as={TextAreaField}
            />
          </div>
          <div>
            <UserSelect
              name="assignees"
              loadData={loadMembers}
              transformData={transformData}
              renderContainer={(data, { removeItem }) =>
                data?.map((user: any) => (
                  <User key={user.label} username={user.label}>
                    <Button onClick={() => removeItem(user.value)}>-</Button>
                  </User>
                ))
              }
            />
          </div>
          <Button
            // disabled={props.isSubmitting || !props.isValid}
            variant="glow"
            className="login-form__btn"
            type="submit"
          >
            Save
          </Button>
        </section>
      </Form>
    </FormikProvider>
  );
};

export default TaskEditorForm;