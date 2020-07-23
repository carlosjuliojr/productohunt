import Layout from '../components/layout/Layout';
import React, { Fragment, useState } from 'react';
import Router from 'next/router';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import firebase from '../firebase/firebase';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

import { css } from '@emotion/core';
import firebaseConfig from '../firebase/config';

export default function Login() {

	//Manejar error al crear la cuenta
	const [error, setError] = useState(false)

	//Estado inicial
	const STATE_INICIAL = {
		email: '',
		password: ''
	};

	const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(
		STATE_INICIAL,
		validarIniciarSesion,
		iniciarSesion
	);

	//Extraer los valores
	const { email, password } = valores;

	async function iniciarSesion(){
		try {
			await firebase.login(email, password);
			Router.push('/')
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<div>
			<Layout>
				<Fragment>
					<h1
						css={css`
							text-align: center;
							margin-bottom: 5rem;
						`}
					>
						Iniciar Sesion
					</h1>
					<Formulario onSubmit={handleSubmit} noValidate>
						<Campo>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								placeholder="Tu email"
								name="email"
								value={email}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>
						{errores.email && <Error>{errores.email}</Error>}
						<Campo>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								placeholder="Tu password"
								name="password"
								value={password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>
						{errores.password && <Error>{errores.password}</Error>}

						{error && <Error>{error}</Error>}

						<InputSubmit type="submit" value="Iniciar Sesion" />
					</Formulario>
				</Fragment>
			</Layout>
		</div>
	);

}
