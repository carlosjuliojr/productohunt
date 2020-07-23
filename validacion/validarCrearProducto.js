export default function validarCrearProducto (valores) {
    let errores = {};

    //Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio";
    }

    //Validar empresa
    if(!valores.empresa){
        errores.empresa = "Nombre de empresa es Obligatorio";
    }

    //Validar url
    if(!valores.url){
        errores.url = "La url es Obligatorio";
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL mal formateada o no valida"
    }
    
    //Validar descripcion
    if(!valores.descripcion){
        errores.descripcion = "Agrega una descripcion a tu producto"
    }


    return errores;
}