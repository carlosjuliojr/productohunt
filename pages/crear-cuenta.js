import Layout from '../components/layout/Layout';
import React, { Fragment,useState } from 'react';
import Router from 'next/router'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import firebase from '../firebase/firebase';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

import { css } from '@emotion/core';
import firebaseConfig from '../firebase/config';

export default function CrearCuenta() {

	//Manejar error al crear la cuenta
	const [error, setError] = useState(false)

	//Estado inicial
	const STATE_INICIAL = {
		nombre: '',
		email: '',
		password: ''
	};

	const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(
		STATE_INICIAL,
		validarCrearCuenta,
		crearCuenta
	);

	//Extraer los valores
	const { nombre, email, password } = valores;

	async function crearCuenta() {
		try {
			await firebase.registrar(nombre, email, password);
			Router.push('/');
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
						Crear Cuenta
					</h1>
					<Formulario onSubmit={handleSubmit} noValidate>
						<Campo>
							<label htmlFor="nombre">Nombre</label>
							<input
								type="text"
								id="nombre"
								placeholder="Tu nombre"
								name="nombre"
								value={nombre}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>
						{errores.nombre && <Error>{errores.nombre}</Error>}
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

						<InputSubmit type="submit" value="Crear Cuenta" />
					</Formulario>
				</Fragment>
			</Layout>
		</div>
	);
}
