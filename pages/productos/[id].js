import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase/index';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

const ContenedorProducto = styled.div`
	@media (min-width: 768px) {
		display: grid;
		grid-template-columns: 2fr 1fr;
		column-gap: 2rem;
	}
`;

const CreadorProducto = styled.p`
	padding: .5rem 2rem;
	background-color: #da552f;
	color: #fff;
	text-transform: uppercase;
	font-weight: bold;
	display: inline-block;
	text-align: center;
`;

const Producto = (params) => {
	//State del componente
	const [ producto, setProducto ] = useState({});
	const [ error, setError ] = useState(false);
	const [ comentario, guardarComentario ] = useState({});
	const [ consultarDB, guardarConsultarDB ] = useState(true);

	// Routing para obtener el id actual
	const router = useRouter();
	const { query: { id } } = router;

	//Context de firebase
	const { firebase, usuario } = useContext(FirebaseContext);

	useEffect(
		() => {
			if (id && consultarDB) {
				const obtenerProducto = async () => {
					const productoQuery = await firebase.db.collection('productos').doc(id);
					const producto = await productoQuery.get();
					if (producto.exists) {
						setProducto(producto.data());
						setError(false);
						guardarConsultarDB(false);
					} else {
						setError(true);
						guardarConsultarDB(false);
					}
				};
				obtenerProducto();
			}
		},
		[ id ]
	);

	if (error) return <Error404 />;

	if (Object.keys(producto).length === 0 && !error) return 'Cargando...';

	const { creador, comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, haVotado } = producto;

	//Administrar validar los botos

	const votarProducto = () => {
		if (!usuario) {
			return router.push('/login');
		}
		//Obtener y sumar nuevo voto
		const nuevoTotal = votos + 1;

		//Verificar si el usuario actual ha votado
		if (haVotado.includes(usuario.uid)) return;

		//Guardar el id del usuario que ha votado
		const nuevoHaVotado = [ ...haVotado, usuario.uid ];

		//Actualiza en la BD
		firebase.db.collection('productos').doc(id).update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

		//Actualizar el state
		setProducto({
			...producto,
			votos: nuevoTotal
		});
		guardarConsultarDB(true); //Hay  un voto consultar a la base de datos
	};

	//Funciones para crear comentarios
	const comentarioChange = (e) => {
		guardarComentario({
			...comentario,
			[e.target.name]: e.target.value
		});
	};

	const agregarComentario = (e) => {
		e.preventDefault();

		if (!usuario) {
			return router.push('/login');
		}
		// Informacion extra al comentario

		comentario.usuarioId = usuario.uid;
		comentario.usuarioNombre = usuario.displayName;

		//Tomar copia de comentraieo sy agregarlos al arreglo
		const nuevosComentarios = [ ...comentarios, comentario ];

		//Atualizar la bd
		firebase.db.collection('productos').doc(id).update({ comentarios: nuevosComentarios });
		//actualizar el state
		setProducto({
			...producto,
			comentarios: nuevosComentarios
		});
		guardarComentario({mensaje : ''});
		guardarConsultarDB(true);

	};

	//Identifica si el comentario es el creador del producto
	const esCreador = (id) => {
		if (creador.id == id) {
			return true;
		}
	};

	//Funcion que revisa que el creador del producto sea el mismo que esta autenticado
	const puedeBorrar = () => {
		if (!usuario) return false;

		if (creador.id === usuario.uid) return true;
	};

	//Eliminar un producto de la bd
	const eliminarProducto = async () => {
		if (!usuario) {
			return router.push('/login');
		}

		if (creador.id !== usuario.uid) {
			return router.push('/');
		}
		try {
			await firebase.db.collection('productos').doc(id).delete();
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Layout>
			<Fragment>
				{error ? (
					<Error404 />
				) : (
					<div className="contenedor">
						<h1
							css={css`
								text-align: center;
								margin-top: 5rem;
							`}
						>
							{nombre}
						</h1>
						<ContenedorProducto>
							<div>
								<p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>
								<p>
									Por: {creador.nombre} de {empresa}
								</p>
								<img src={urlimagen} />
								<p>{descripcion}</p>

								{usuario && (
									<Fragment>
										<h2>Agrega tu comentario</h2>
										<form onSubmit={agregarComentario}>
											<Campo>
												<input type="text" name="mensaje" value={comentario.mensaje} onChange={comentarioChange} />
												<InputSubmit type="submit" value="Agregar Comentario" />
											</Campo>
										</form>
									</Fragment>
								)}

								<h2 css={css`margin: 2rem 0;`}>Comentarios</h2>

								{comentarios.length === 0 ? (
									<p>Aun no hay comentarios</p>
								) : (
									<ul>
										{comentarios.map((comentario, i) => {
											return (
												<li
													key={`${comentario.usuarioId}-${i}`}
													css={css`
														border: 1px solid #e1e1e1;
														padding: 2rem;
													`}
												>
													<p>{comentario.mensaje}</p>
													<p>
														Escrito por:
														<span css={css`font-weight: bold;`}>
															{' '}
															{comentario.usuarioNombre}
														</span>
													</p>
													{esCreador(comentario.usuarioId) && (
														<CreadorProducto> Es Creador</CreadorProducto>
													)}
												</li>
											);
										})}
									</ul>
								)}
							</div>

							<aside>
								<Boton target="_blank" bgColor="true" href={url}>
									Visitar url
								</Boton>

								<div css={css`margin-top: 5rem;`}>
									{usuario && <Boton onClick={votarProducto}>Votar</Boton>}
									<p css={css`text-align: center;`}>{votos} Votos</p>
								</div>
							</aside>
						</ContenedorProducto>
						{puedeBorrar() && <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>}
					</div>
				)}
			</Fragment>
		</Layout>
	);
};

export default Producto;
