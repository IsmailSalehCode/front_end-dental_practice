<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dense dark>
        <v-spacer></v-spacer>
        <v-btn icon :loading="loadingCRUD" @click="refresh()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title class="justify-center pt-5">
        {{ $t("Personnel") }}
      </v-card-title>
      <hr />
      <v-container style="text-align: center">
        <v-btn
          tile
          depressed
          @click="validateAndAction('edit')"
          color="info"
          :loading="loadingCRUD"
          >{{ $t("edit") }}</v-btn
        >
        <v-btn
          tile
          depressed
          @click="validateAndAction('delete')"
          color="error"
          :loading="loadingCRUD"
          >{{ $t("delete") }}
        </v-btn>
        <v-btn
          tile
          depressed
          color="#fd9400"
          :loading="loadingCRUD"
          dark
          @click="validateAndAction('toggle')"
        >
          {{ $t(toggleBtn_label) }}
        </v-btn>
      </v-container>
      <v-card-text>
        <v-text-field
          style="max-width: 350px"
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search')"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          disable-sort
          :search="search"
          :loading="loadingCRUD"
          :loading-text="$t('Loading... Please wait')"
          :no-results-text="$t('No matching records found')"
          :no-data-text="$t('No data available')"
          v-model="selected"
          :headers="headers"
          :items="users"
          :items-per-page="10"
          :single-select="true"
          item-key="id"
          show-select
          class="elevation-1"
        ></v-data-table>
      </v-card-text>
    </v-card>
    <UserEditDialog
      ref="edit_dialog"
      @refreshUsers="refresh()"
      @done="showPopUpMessage_Done()"
    />
    <PopUp ref="popUp" />
  </v-dialog>
</template>

<script>
import UserService from "../services/UserService";
import PopUp from "../components/PopUp.vue";
import responseEval from "../Mixins/responseEval";
import UserEditDialog from "../components/UserEditDialog.vue";
export default {
  mixins: [responseEval],
  components: {
    PopUp,
    UserEditDialog,
  },
  methods: {
    showPopUpMessage_Done() {
      this.$refs.popUp.open("done");
    },
    validateAndAction(action) {
      const arr = this.selected;
      if (arr.length == 1) {
        const selectionId = arr[0].id;
        switch (action) {
          case "delete":
            this.deleteUser(selectionId);
            break;
          case "toggle":
            this.toggleUser(selectionId);
            break;
          case "edit":
            this.openEditDialog(arr[0]);
            break;
          default:
            break;
        }
      } else {
        alert(this.$t("No row selected"));
      }
    },
    openEditDialog(user) {
      this.$refs.edit_dialog.open(user);
    },
    async toggleUser(id) {
      let response = null;
      this.loadingCRUD = true;
      try {
        response = await UserService.toggleUser(id);
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.showPopUpMessage_Done();
      }
      this.loadingCRUD = false;
      this.refresh();
    },
    async deleteUser(id) {
      let response = null;
      this.loadingCRUD = true;
      try {
        response = await UserService.deleteUser(id);
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.showPopUpMessage_Done();
      }
      this.loadingCRUD = false;
      this.refresh();
    },
    refresh() {
      this.selected = [];
      this.getUsers();
    },
    async getUsers() {
      let response = null;
      this.users = [];
      this.loadingCRUD = true;
      try {
        response = await UserService.getUsers();
      } catch (err) {
        this.evalError(err);
      }
      if (this.isSuccessful(response)) {
        this.users = response.data;
      }
      this.loadingCRUD = false;
    },
    open() {
      this.dialog = true;
      this.refresh();
    },
    close() {
      this.dialog = false;
    },
  },
  data() {
    return {
      dialog: false,
      loadingCRUD: false,
      users: [],
      selected: [],
      search: "",
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "ID",
          align: "start",
          value: "id",
        },
        {
          text: this.$t("username"),
          value: "username",
        },
        {
          text: this.$t("password"),
          value: "password",
        },
        {
          text: this.$t("contactForm.emailLabel"),
          value: "email",
        },
        {
          text: this.$t("contactForm.phoneLabel"),
          value: "phone",
        },
        {
          text: this.$t("other contact info"),
          value: "otherContact",
        },
        {
          text: this.$t("role"),
          value: "role",
        },
        {
          text: this.$t("isEnabled"),
          value: "enabled",
        },
        {
          text: this.$t("registered on"),
          value: "createdAt",
        },
        {
          text: this.$t("updated on"),
          value: "updatedAt",
        },
      ];
    },
    toggleBtn_label() {
      const arr = this.selected;
      if (arr.length == 1) {
        const selection = arr[0];
        return selection.enabled == true ? "disable" : "enable";
      } else {
        return "toggle";
      }
    },
  },
};
</script>

<style>
</style>