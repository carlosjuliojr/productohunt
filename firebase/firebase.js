import app from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'

class FireBase {
	constructor() {
		if (!app.apps.length) {
			app.initializeApp(firebaseConfig);
        }
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
	}

	//Registra un usuario
	async registrar(nombre, email, password) {
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email,password);
        return await nuevoUsuario.user.updateProfile({
            displayName : nombre
        })
    }

    //Inicia sesion del usuario
    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password);
    }

    //Cierra la sesion del usuario
    async cerrarSesion(){
        await this.auth.signOut();
    }

}

const firebase = new FireBase();

export default firebase;
