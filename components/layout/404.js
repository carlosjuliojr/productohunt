import React, {Fragment} from 'react';
import { css } from '@emotion/core';
import Layout from './Layout';

const Error404 = () => {
	return (
		<Layout>
			<Fragment>
				<h1
					css={css`
						margin-top: 5rem;
						text-align: center;
					`}
				>
					No se puede mostrar
				</h1>
			</Fragment>
		</Layout>
	);
};

export default Error404;
