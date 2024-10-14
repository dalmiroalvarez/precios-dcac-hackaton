import { useState, useEffect, useRef } from 'react';
import { SendIcon, MicIcon, KeyboardIcon } from 'lucide-react';
import { uploadAudioFile, sendChatMessage } from '../api/audioService'; 

const Search = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [messageAnimation, setMessageAnimation] = useState({});
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const messagesEndRef = useRef(null);

  // Efecto para hacer scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      startRecording();
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRecording && recorder) {
      clearInterval(interval);
      stopRecording();
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder);

      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        setIsRecordingStopped(true);
        setRecordingTime(0);
        audioChunks = [];
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error al acceder al micrófono", error);
    }
  };

  const stopRecording = () => {
    recorder && recorder.stop();
    setIsRecording(false);
  };

  const handleDeleteRecording = (e) => {
    e.stopPropagation();
    setIsRecordingStopped(false);
    setRecorder(null);
    setAudioURL('');
    setRecordingTime(0);
    setAudioBlob(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Crear el nuevo mensaje
        const newMessage = { text: inputMessage, sender: 'user', timestamp };

        // Agregar el mensaje del usuario al estado
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Verificar si el mensaje es "hola"
        if (inputMessage.toLowerCase() === 'hola') {
            // Agregar una respuesta especial
            const holaMessage = { text: '¡Hola! Soy tu asistidor de Precios. puedes preguntarme algo como "Dime el precio de 200 novillitos de 250 kilogramos en la zona de Trenque Lauquen.', sender: 'api', timestamp };
            setMessages((prevMessages) => [...prevMessages, holaMessage]);
            setAwaitingResponse(true); // Indicar que estamos esperando una respuesta
        } else if (awaitingResponse) {
            // Aquí simular la respuesta si estamos esperando una pregunta sobre precios
            const simulatedResponse = simulatePriceResponse(inputMessage);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    text: simulatedResponse,
                    sender: 'api',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
            setAwaitingResponse(false); // Reiniciar el estado
        } else {
            // Manejar mensajes normales
            try {
                const response = await sendChatMessage(inputMessage); // Aquí envías el mensaje

                // Agregar la respuesta de la API
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: response.reply || 'No se recibió respuesta', // Manejar caso sin respuesta
                        sender: 'api',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                ]);
            } catch (error) {
                console.error('Error enviando el mensaje:', error);

                // Agregar un mensaje al chat en caso de error
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.',
                        sender: 'api',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                ]);
            }
        }

        // Limpiar el campo de entrada
        setInputMessage('');

        setMessageAnimation({ entering: true });
        setTimeout(() => setMessageAnimation({}), 300);
    }
};

  const handleSendAudio = async () => {
    if (audioBlob) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage = { audio: audioURL, sender: 'user', timestamp };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            // Enviar la grabación a la API y recibir la transcripción
            const result = await uploadAudioFile(audioBlob);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    text: result.transcription || 'No se recibió transcripción', // Manejar caso sin transcripción
                    sender: 'api',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } catch (error) {
            console.error('Error subiendo el archivo de audio:', error);

            // Verificar si error tiene una respuesta y tratar de obtener datos
            if (error.response) {
                const errorData = await error.response.text(); // Obtener el cuerpo de la respuesta
                console.error('Error data:', errorData); // Imprimir el cuerpo de error
            } else {
                console.error('Error sin respuesta del servidor:', error.message); // Manejar error sin respuesta
            }

            // Agregar un mensaje al chat en caso de error
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    text: 'Hubo un error al enviar el audio. Inténtalo de nuevo.',
                    sender: 'api',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }

        // Limpiar el estado después de enviar
        setAudioURL('');
        setAudioBlob(null);
        setIsRecordingStopped(false);
        setRecorder(null);
    }
};

const simulatePriceResponse = (input) => {
    // Simular una respuesta basada en la pregunta del usuario
    return `Para la pregunta sobre "${input}", el precio es de $2500 por novillito.`;
};

  const handleRecordAgain = () => {
    setIsRecordingStopped(false);
    setAudioURL('');
    setRecordingTime(0);
    setAudioBlob(null);
    setIsRecording(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-8 container mx-auto mb-6">
      <div className="flex justify-between items-center">
        {isRecording ? (
          <KeyboardIcon
            size={30}
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsRecording(false)}
          />
        ) : (
          <MicIcon
            size={30}
            className="text-red-600 cursor-pointer"
            onClick={() => setIsRecording(true)}
          />
        )}
      </div>

      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
        Consultá Precios
      </h2>
      <h3 className='text-center mb-3 text-lg md:text-xl font-medium text-gray-700/70'>
        Preguntá por los precios de la categoría, zona o peso que estás buscando
      </h3>

      <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded p-2" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'} ${messageAnimation.entering ? 'message-enter' : ''}`}
          >
            {msg.audio ? (
              <audio controls src={msg.audio} className="w-[90%] sm:w-[25%] inline-block"></audio>
            ) : (
              <span
                className={`inline-block p-2 sm:text-lg text-sm px-10 mb-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-primary text-white mr-4' : 'bg-gray-200'
                }`}
              >
                {msg.text}
              </span>
            )}
            <div className="text-xs text-gray-500 mr-4">
              {msg.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isRecordingStopped ? (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handleSendAudio} // Botón para enviar grabación
            className="bg-green-600 text-white px-4 py-2 sm:text-lg text-xs rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Enviar Grabación
          </button>
          <button
            onClick={handleRecordAgain}
            className="bg-primary text-white sm:text-lg text-xs px-4 py-2 rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Grabar de Nuevo
          </button>
          <button
            onClick={handleDeleteRecording}
            className="bg-red-500 text-white px-4 py-2 sm:text-lg text-xs rounded-xl hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-4"
          >
            Eliminar Grabación
          </button>
        </div>
      ) : isRecording ? (
        <div className="flex justify-center items-center flex-col">
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
          >
            Detener grabación
          </button>
          <p className="text-xl font-semibold text-gray-600">Grabando: {recordingTime} segundos</p>
        </div>
      ) : (
        ""
      )}

      {!isRecording && !isRecordingStopped && (
        <form onSubmit={handleSendMessage} className="flex mt-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ej: Decime el precio de 200 novillitos de 300 kilos en la zona de Bolivar..."
            className="flex-grow border border-gray-300 rounded-l-lg px-3 py-6 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 rounded-r-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <SendIcon size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default Search;
