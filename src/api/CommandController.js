import axios from './axios'

class CommandController {
    static sendCommand(command) {
        return axios.post('/send-command', { command })
            .then(response => response.data)
            .catch(error => {
                console.error('Error:', error);
                throw error; // Re-throw error for handling in the component
            });
    }

    static getRustOutput() {
        return axios.get('/rust-output')
            .then(response => response.data)
            .catch(error => {
                console.error('Error:', error);
                throw error; // Re-throw error for handling in the component
            });
    }
}

export default CommandController;
