import axios from 'axios';
import { showAlert } from './alerts';

export const review = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/cart',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `successfully added your review`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
