import React, { useState, useContext } from "react";
import * as Yup from "yup";
import "./BoardEditor.scss";
import { ReactComponent as Spinner } from "assets/spinners/Infinity-1s-200px.svg";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import User from "components/User/User";
import Button from "components/Button/Button";
import { Formik, Field, Form } from "formik";
import TextInput from "components/TextInput/TextInput";
import AutoCompleteInput from "components/AutoCompleteInput/AutoCompleteInput";
import { ModalContext } from "context/ModalContext";

import fetchData from "helper/fetchData";
import { useHistory } from "react-router-dom";

// import { userList_DATA } from "data";

const validationSchema = Yup.object({
	name: Yup.string().max(25, "board name is too long").required("field is required"),
	description: Yup.string().max(200, "description is too long"),
});

const BoardEditor = ({ submitDataURL, buttonName, initialValues }) => {
	const [users, setUsers] = useState(!!initialValues ? initialValues.members : []);
	const [searchRes, setSearchRes] = useState([]);

	const [, dispatchModal] = useContext(ModalContext);

	const history = useHistory();

	const initialVals = {
		name: initialValues ? initialValues.name : "",
		description: initialValues ? initialValues.description : "",
	};

	const submitButtonClick = async (submittedData, { setSubmitting }) => {
		submittedData = { ...submittedData, members: users.map(({ _id }) => _id) };
		const { data } = await fetchData({
			method: "POST",
			url: submitDataURL,
			token: true,
			setLoading: setSubmitting,
			payload: submittedData,
		});
		if (!!data) {
			dispatchModal({ type: "CLOSE" });
			console.log("test: ", data);
			const boardId = data.board._id;
			history.push(`/board/${boardId}`);
		}
		// if (updateBoard !== undefined) {
		// 	const { data } = await fetchData({
		// 		method: "POST",
		// 		url: `/board/${initialValues.id}`,
		// 		token: true,
		// 		setLoading: setSubmitting,
		// 		payload: submittedData,
		// 	});
		// 	if (!!data) dispatchModal({ type: "CLOSE" });
		// }
	};
	const searchUsers = async (username) => {
		const { data } = await fetchData({
			method: "GET",
			url: `user/find_user?username=${username}`,
			token: true,
		});
		if (!!data) {
			const parsedResult = data.map((user) => ({
				...user,
				text: user.username,
			}));
			setSearchRes(parsedResult);
		}
	};
	const clearUserSearchResults = () => {
		setSearchRes([]);
	};
	const addUserToBoardHandler = (user) => {
		setSearchRes([]);
		const tempUsers = [...users];
		tempUsers.push(user);
		setUsers(tempUsers);
	};
	const removeUserFromBoardHandler = (userId) => {
		setUsers((currentUserList) => currentUserList.filter(({ _id }) => _id !== userId));
	};
	return (
		<div className="board-form-container">
			<Formik
				validationSchema={validationSchema}
				initialValues={initialVals}
				onSubmit={submitButtonClick}
			>
				{({ isSubmitting, isValid, errors }) => (
					<>
						{isSubmitting && (
							<div className="spinner-overlay">
								<Spinner />
							</div>
						)}
						<Form>
							<div className="fields">
								<Field
									className="board-name-input"
									label="board name"
									name="name"
									hasErrors={!!errors["name"]}
									helperText={errors["name"]}
									classes={["board-name-field"]}
									as={TextInput}
								/>
								<Field
									name={"description"}
									classes={["board-description-field"]}
									multiline={{ rows: 7, max: 7 }}
									hasErrors={!!errors["description"]}
									helperText={errors["description"]}
									as={TextInput}
								/>
							</div>
							<div className="user-container">
								<AutoCompleteInput
									execMethod={searchUsers}
									timeout={700}
									searchResult={searchRes.filter(
										({ _id }) =>
											users.findIndex(({ _id: chosenUserId }) => chosenUserId === _id) <
											0
									)}
									clickResult={addUserToBoardHandler}
									clearResults={clearUserSearchResults}
								/>
								<div
									className={`user-card-container ${
										users.length > 4 ? "overflow-scroll" : ""
									}`}
								>
									{users.map(({ _id, username, avatarImageURL }) => (
										<User key={_id} username={username} imageURL={avatarImageURL}>
											<RemoveCircleOutlineIcon
												onClick={() => removeUserFromBoardHandler(_id)}
											/>
										</User>
									))}
								</div>
							</div>
							<Button
								disabled={isSubmitting || !isValid}
								classes={["btn-accent", "btn-submit"]}
								type="submit"
							>
								{buttonName}
							</Button>
						</Form>
					</>
				)}
			</Formik>
		</div>
	);
};

export default BoardEditor;
