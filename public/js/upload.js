import axios from 'axios';
import { showAlert } from './alerts';

export const uploadProduct = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/product',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'New product has been added');
    }
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
    showAlert('error', err.response ? err.response.data.message : err.message);
  }
};
