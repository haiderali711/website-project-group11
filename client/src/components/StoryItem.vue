<template>
  <div class="post_container">
    <div class="post_content">
      <div class="post_header">
        <div class="post_avatar_wrapper">
          <div class="post_avatar"></div>
          <span class="post_username">{{userN}}</span>
        </div>
        <div class="post_actions">
          <bookmark bookmarked="gold" fill-color="gold" v-bind:style="{ marginRight: '10px' }" />
          <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
            <template v-slot:button-content class="drop_down_button">
              <img src="../assets/moreActions.svg" alt="more actions">
            </template>
            <b-dropdown-item
              v-on:click="$emit('show-edit-story-modal', story._id)"
              v-if = checkIfYours
            >
              Edit Story
            </b-dropdown-item>

            <b-dropdown-item
              v-on:click="$emit('show-replace-story-modal', story._id)"
              v-if = checkIfYours
            >
              Replace Story
            </b-dropdown-item>
            
            <b-dropdown-item v-on:click="$emit('delete-story', story._id)" v-if = checkIfYours>Delete Story</b-dropdown-item>
            <b-dropdown-item href="#">Report Story</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>

      <a href="#">
        <div v-on:click="$emit('show-detailed-story-modal', story)">
          <h4>{{story.title}}</h4>
          <p class="post_excerpt">
            {{story.content}}
          </p>
        </div>
      </a>
      <span
        v-bind:style="{ color: '#495057c7' }"
      >
        <date :date="story.published" /> • <reading-time :content="story.content" />
      </span>
    </div>
  </div>
</template>

<script>
import { Api } from '../Api';
import Bookmark from './shared/Bookmark';
import Date from './shared/Date';
import ReadingTime from './shared/ReadingTime';
import CookiesController from '../utils/CookiesController.js';


export default {
  name: 'story-item',
  props: ['story'],
  data() {
    return {     
      userN : "",
      checkIfYours : false
    };
  },
  components: {
    Bookmark,
    Date,
    ReadingTime
  },
  methods: {
    getUsername(id){
      Api.get('/users/'+id)
        .then(response => {
          this.userN = response.data.username;
          if ((this.userN == CookiesController.getCookieValue("username"))){
            this.checkIfYours = true;
          }else{
            this.checkIfYours = false;
          }
          if (CookiesController.getCookieValue("moderator") == "true"){
            this.checkIfYours = true;
          }
        })
        .catch(error => {
          console.log(error)
        });
    }
  },
  mounted(){
    this.getUsername(this.story.user);
  }
};
</script>

<style scoped>
  .post_container {
    color: #495057;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }

  .post_content {
    padding: 15px 20px 0 20px;
  }
  .post_content > a {
    color: inherit;
  }

  .post_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .post_excerpt {
    max-height: 81px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }

  .reactions > span > img {
    margin-top: -3px;
  }
</style>
