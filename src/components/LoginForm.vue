<template>
  <b-container class="mt-5">
    <b-row class="justify-content-md-center">
      <b-col md="4">
        <b-card title="Login" class="text-center">
          <b-form @submit.prevent="onSubmit">
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                type="email"
                v-model="loginForm.email"
                placeholder="Enter your email"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="errors.email">{{ errors.email }}</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Password" label-for="password">
              <b-form-input
                id="password"
                type="password"
                v-model="loginForm.password"
                placeholder="Enter your password"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="errors.password">{{ errors.password }}</b-form-invalid-feedback>
            </b-form-group>

            <b-button type="submit" variant="primary" block>Login</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useAuthStore } from '../stores/Auth/useAuthStore';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const loginForm = reactive({
      email: '',
      password: '',
    });

    const errors = reactive({
      email: '',
      password: '',
    });




    const onSubmit = async () => {
  

      try {
        const nextRoute = route.query.next || '/dashboard'; // Varsayılan yönlendirme
        await authStore.login(loginForm.email, loginForm.password, nextRoute as string);
        await router.push(nextRoute as string);
      } catch (error) {
        console.error('Login error:', error);
      }
    };

    return {
      loginForm,
      errors,
      onSubmit,
    };
  },
});
</script>

<style scoped>
/* İsteğe bağlı stiller */
</style>