<template>
  <v-container>
    <v-card rounded="lg" style="max-width: 260px; margin: auto">
      <v-card-title>{{ $t("profile") }}</v-card-title>
      <v-card-text>
        <p>{{ $t("username") }}: {{ currentUser.username }}</p>
        <p>{{ $t("role") }}: {{ $t(currentUser.role) }}</p>
      </v-card-text>
    </v-card>
    <v-container v-if="isManager" style="text-align: center">
      <v-btn @click="openSiteDesignConfigDialog()">
        {{ $t("Settings") }}
        <v-icon right>mdi-shield-star</v-icon>
      </v-btn>
    </v-container>
    <div v-if="this.$store.state.sdc.wants_appointmentScheduling">
      <AddNewAppointmentDateTime />
      <GetDeleteAppointmentDateTimes />
    </div>
    <v-container>
      <v-btn @click="openManageContactFormsDialog()">{{
        $t("Open the contact forms")
      }}</v-btn>
    </v-container>
    <v-container v-if="isManager">
      <v-btn @click="openManageUsersDialog()"
        >{{ $t("Manage users") }}<v-icon right>mdi-shield-star</v-icon></v-btn
      >
    </v-container>
    <ManageUsers ref="manage_users" />
    <ManageContactForms ref="manage_contact_forms" />
    <v-container v-if="isManager">
      <v-btn @click="openAddNewUserDialog()"
        >{{ $t("Add personnel") }}
        <v-icon right>mdi-shield-star</v-icon>
      </v-btn>
    </v-container>
    <AddNewUserDialog ref="add_new_user" />
    <v-container v-if="isManager">
      <v-btn @click="openEditBusinessDetailsDialog()">
        {{ $t("Edit Business Details") }}
        <v-icon right>mdi-shield-star</v-icon>
      </v-btn>
    </v-container>
    <EditBusinessDetailsDialog
      ref="edit_business_details"
      @done="triggerPopUp()"
    />
    <hr />
    <br />
    <v-container style="max-width: 435px">
      <TechSupport />
    </v-container>

    <br />
    <br />
    <PopUp ref="popUp" />
    <SiteDesignConfigDialog ref="site_design_config" @done="triggerPopUp()" />
  </v-container>
</template>

<script>
import AddNewUserDialog from "../components/AddNewUserDialog.vue";
import AddNewAppointmentDateTime from "../components/AddNewAppointmentDateTime.vue";
import GetDeleteAppointmentDateTimes from "../components/GetDeleteAppointmentDateTimes.vue";
import ManageContactForms from "../components/ManageContactForms.vue";
import ManageUsers from "../components/ManageUsers.vue";
import TechSupport from "../components/TechSupport.vue";
import EditBusinessDetailsDialog from "../components/EditBusinessDetailsDialog.vue";
import PopUp from "../components/PopUp.vue";
import SiteDesignConfigDialog from "../components/SiteDesignConfigDialog.vue";

export default {
  methods: {
    openSiteDesignConfigDialog() {
      this.$refs.site_design_config.open();
    },
    triggerPopUp() {
      this.$refs.popUp.open("done");
    },
    openEditBusinessDetailsDialog() {
      this.$refs.edit_business_details.open();
    },
    openAddNewUserDialog() {
      this.$refs.add_new_user.open();
    },
    openManageContactFormsDialog() {
      this.$refs.manage_contact_forms.open();
    },
    openManageUsersDialog() {
      this.$refs.manage_users.open();
    },
  },
  components: {
    AddNewUserDialog,
    AddNewAppointmentDateTime,
    GetDeleteAppointmentDateTimes,
    ManageContactForms,
    ManageUsers,
    TechSupport,
    EditBusinessDetailsDialog,
    PopUp,
    SiteDesignConfigDialog,
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
    isManager() {
      return this.$store.state.user.role === "Manager";
    },
  },
};
</script>

<style></style>
