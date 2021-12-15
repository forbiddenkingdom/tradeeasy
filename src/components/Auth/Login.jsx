import React, { Fragment, useState, useRef, useLayoutEffect, useEffect } from "react";
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import { Box, makeStyles, Typography } from "@material-ui/core";
import "@fontsource/karla";
import theme from "lib/theme"
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Logo from "assets/img/logo.png";
import { useTranslation } from "react-i18next";


const useStyles = makeStyles(() => ({
	root: {
		color: "#25AAE2",
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backdropFilter: 'blur(6px)'
	},
	paper: {
		backgroundColor: "#1A2B47",
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 2, 2),
		display: 'flex',
		flexDirection: 'column'
	},
	textSeparation: {
		margin: "1rem 1rem 0.3rem 0",
		color: '#ADC0CF'
	},
	inputField: {
		fontSize: '1.3rem',
		backgroundColor: 'white'
	},
	logo: {
		width: '200px',
		marginTop: '20px',
		marginBottom: '20px'
	},
	forgetPassword: {
		color: '#32A5DE',
		textDecoration: 'none',
		fontSize: '1rem',
		marginTop: '10px'
	}
}));

const Login = () => {

	const classes = useStyles();

	const localUserId = localStorage.getItem('user_id');
	const isUserLoggedIn = localUserId && !isNaN(localStorage.getItem('user_id'))

	const [showPassword, setShowPassword] = useState(false);
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const [t] = useTranslation(["login"]);

	// Modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => { setOpen(true); };
	const handleClose = () => { setOpen(false); };

	useEffect(() => {
		if (isUserLoggedIn) {
			handleClose();
		} else {
			handleOpen();
		}
	}, [isUserLoggedIn]);

	const onSubmit = async () => {
		try {
			const abortController = new AbortController();
			const response = await fetch(`${process.env.REACT_APP_TRADEASY_API}users/login`,
				{
					method: 'POST',
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify({ "email": userName, "password": password })
				},
				{ signal: abortController.signal });

			if (!response.ok) throw new Error('User login failed');
			const data = await response.json();

			if (data.success) {
				localStorage.setItem('user_id', data.user_id);
				setOpen(false);
				location.reload();
			} else {
				localStorage.removeItem('user_id');
				window.alert('Usuario o contraseña incorrecto');
			}
		} catch (err) {
			console.log(err);
			window.alert('Error inesperado, contacte con soporte');
		}
	}

	// useEffect(async () => {
	//   const abortController = new AbortController();
	//   let url = process.env.REACT_APP_TRADEASY_API;
	//   const userId = localStorage.getItem("user_id");

	//   // Fetch strategies or shared strategies.
	//   value == 1 ? (url = `${url}strategies/user/${userId}`) : (url = `${url}sharedStrategies/`);

	//   try {
	//     const response = await fetch(url, { signal: abortController.signal });
	//     if (!response.ok) throw new Error("Strategy fetch finished with errors.");
	//     const data = await response.json();
	//     setStrategies(data);
	//   } catch (error) {
	//     console.error("There was an error fetching Strategies. Please contact support for further information." + error);
	//   }
	//   return () => { abortController.abort(); };
	// }, [value]);

	return <>
		<div>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				// onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<Box className={classes.paper}>

						<Box display='flex' justifyContent='center'>
							<img className={classes.logo} src={Logo} alt="tradEAsy Logo" />
						</Box>

						<Box width="100%">
							<Typography variant="body1" color="textPrimary" className={classes.textSeparation} >
							{t("email")}
							</Typography>
							<FormControl fullWidth>
								<OutlinedInput className={classes.inputField} type="text" variant="outlined" margin="dense" name="username" onChange={(e) => setUserName(e.target.value)} value={userName} />
							</FormControl>
						</Box>
						<Box width="100%" marginTop="30px">
							<Typography variant="body1" color="textPrimary" className={classes.textSeparation} >
								{t("password")}
							</Typography>

							<FormControl>
								<OutlinedInput className={classes.inputField} type={showPassword ? "text" : "password"} variant="outlined" margin="dense" onChange={e => setPassword(e.target.value)} value={password}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
								/>
								<FormHelperText component="a" href="https://tradeasy.tech/mi-cuenta/lost-password/" className={classes.forgetPassword}>
									{t("forgotPassword")}
								</FormHelperText>
							</FormControl>
						</Box>
						<Box width="50%" margin="auto" marginTop="30px">
							<Button variant="contained" color="primary" fullWidth size="large" onClick={onSubmit}>
								{t("Login")}
							</Button>
						</Box>

						<Box marginTop="20px">
							<Typography variant="body1" style={{ color: 'white' }}>{t("noAccount")}</Typography>
							<FormHelperText component="a" href="https://tradeasy.tech/registro-tradeasy2/" className={classes.forgetPassword}>
								{t("signupHere")}
							</FormHelperText>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</div>
	</>;
};

Login.propTypes = {
}

export default Login;
