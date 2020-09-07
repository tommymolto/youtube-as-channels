<template>
  <div id="app">
    <Header/>
    <SearchForm v-on:search="search"/>
      <button
          type="primary"
          icon="fas fa-edit"
          @click="handleClickLogin"

      >get authCode</button>
      <button
          type="primary"
          icon="fas fa-edit"
          @click="handleClickSignIn"

      >sign in</button>
    <SearchResults
        v-if="videos.length > 0"
        v-bind:videos="videos"
        v-bind:reformattedSearchString="reformattedSearchString"
    />
    <Pagination
        v-if="videos.length > 0"
        v-bind:prevPageToken="api.prevPageToken"
        v-bind:nextPageToken="api.nextPageToken"
        v-on:prev-page="prevPage"
        v-on:next-page="nextPage"
    />
  </div>
</template>

<script>
import Header from './Header';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Pagination from './Pagination';
import axios from 'axios';

export default {
  name: "Teste",
  components: {
    Header,
    SearchForm,
    SearchResults,
    Pagination
  },
  data() {
    return {
      videos: [],
      reformattedSearchString: '',
      token:'',
      api: {
        // baseUrl: 'https://www.googleapis.com/youtube/v3/search?',
        baseUrl: 'https://content.googleapis.com/youtube/v3/subscriptions?',
        mine: 'false',
        part: 'snippet',
        type: 'video',
        // order: 'viewCount',
        order: 'alphabetical',
        maxResults: 12,
        q: '',
        key: 'AIzaSyD6BkV2XCm82hBsbM4YHx0EMnGc1_lLnoE',
        prevPageToken: '',
        nextPageToken: ''
      }
    };
  },
  methods: {
    async handleClickUpdateScope() {
      const option = new window.gapi.auth2.SigninOptionsBuilder();
      // https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner
      option.setScope("email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly");
      const googleUser = this.$gAuth.GoogleAuth.currentUser.get();
      try {
        await googleUser.grant(option);
        console.log("success");
      } catch (error) {
        console.error(error);
      }
    },
    handleClickLogin() {
      this.$gAuth
          .getAuthCode()
          .then(authCode => {
            //on success
            this.token = authCode;
            console.log("authCode", authCode);
          })
          .catch(error => {
            //on fail do something
            console.log('err',error)
          });
    },
    async handleClickSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        console.log("googleUser", googleUser);
        console.log("getId", googleUser.getId());
        console.log("getBasicProfile", googleUser.getBasicProfile());
        console.log("getAuthResponse", googleUser.getAuthResponse());
        console.log(
            "getAuthResponse",
            this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
        );
        this.token=this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse().access_token;
        this.isSignIn = this.$gAuth.isAuthorized;
      } catch (error) {
        //on fail do something
        console.error('errrrr', error);
      }
    },
    search(searchParams) {
      const token = this.token; //'ya29.a0AfH6SMDQT_ckEl26fDIR73DxuUFIoCVaFMkAneLShWZThPQKO7gpAyWl0NM0AzgBefk4PLQQ9gV4bfRpk6OohDIG_zmqaAPuetBkAb5FVBrNrnY0TM9IxS7Z-vlnz9EG1ICqdBzASP-IAD9yqM6y6T1E2_rBo_6mKkg4_gHqLqapVMA'
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const bodyParameters = {
        key: "value"
      };
      this.reformattedSearchString = searchParams.join(' ');
      this.api.q = searchParams.join('+');
      const { baseUrl, mine, part, type, order, maxResults, q, key } = this.api;
      // const apiUrl = `${baseUrl}part=${part}&type=${type}&order=${order}&q=${q}&maxResults=${maxResults}&key=${key}`;
      const apiUrl = `${baseUrl}mine=true&part=${part}&type=${type}&order=${order}&q=${q}&maxResults=${maxResults}&key=${key}&access_token=${token}`;
      this.getData(apiUrl, config);
    },

    prevPage() {
      const { baseUrl, mine, part, type, order, maxResults, q, key, prevPageToken } = this.api;
      const apiUrl = `${baseUrl}mine=${mine}&part=${part}&type=${type}&order=${order}&q=${q}&maxResults=${maxResults}&key=${key}&pageToken=${prevPageToken}`;
      this.getData(apiUrl);
    },

    nextPage() {
      const { baseUrl, mine, part, type, order, maxResults, q, key, nextPageToken } = this.api;
      const apiUrl = `${baseUrl}mine=${mine}&part=${part}&type=${type}&order=${order}&q=${q}&maxResults=${maxResults}&key=${key}&pageToken=${nextPageToken}`;
      this.getData(apiUrl);
    },

    getData(apiUrl, config) {
      axios
          .get(apiUrl, config)
          .then(res => {
            this.videos = res.data.items;
            this.api.prevPageToken = res.data.prevPageToken;
            this.api.nextPageToken = res.data.nextPageToken;
          })
          .catch(error => console.log(error));
    }
  }
}
</script>

<style scoped>

</style>
