export const uploadAudioFile = async (audioBlob) => {
    const formData = new FormData();
    formData.append(audioBlob, 'audio'); // Nombre del archivo y formato

    try {
        const response = await fetch('http://192.168.1.123:8000/api/transcribe-audio', {
            method: 'POST',
            body: formData,
            headers: {
                // Aquí puedes añadir cualquier cabecera adicional si es necesario (ej. autorización)
            },
        });
    
        console.log('Response:', response);
    
        // Verificar si el contenido de la respuesta es HTML
        const textResponse = await response.text();
        console.log('Response Text:', textResponse); // Log del contenido de la respuesta
    
        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }
    
        const data = JSON.parse(textResponse); // Intentar convertir el texto a JSON
        console.log('Data:', data); // Log de la respuesta JSON
        return data; // Suponiendo que devuelves la transcripción en el objeto de respuesta
    } catch (error) {
        console.error('Error al subir el archivo de audio:', error);
        throw error; // Relanzar el error para manejarlo en el componente
    }
};

export const sendChatMessage = async (message) => {
    try {
        const response = await fetch('http://192.168.1.123:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el servidor acepte JSON
            },
            body: JSON.stringify({ message }), // Suponiendo que envías un objeto con la propiedad 'message'
        });

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json(); // Obtener la respuesta en formato JSON
        console.log('Respuesta del servidor:', data); // Manejar la respuesta
        return data; // Devuelve la respuesta para uso posterior
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error; // Relanzar el error si es necesario
    }
};