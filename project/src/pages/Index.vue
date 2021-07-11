<template>
  <div class="content">
    <h3>Thông tin ứng viên</h3>
    <q-page class="">
      <div class="q-pa-md">
        <div style="margin-bottom: 15px">
          <q-btn
            color="primary"
            label="Thêm mới"
            @click="openDialogInfo(null, true)"
          />
        </div>
        <q-table
          :rows="lstData"
          :columns="columns"
          row-key="id"
          no-data-label="Không có thông tin ứng viên"
          :filter="filter"
          flat
          bordered
          binary-state-sort
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>
                {{ props.row.id }}
              </q-td>
              <q-td>
                <a @click="openDialogInfo(props.row, false)" class="router">
                  {{ props.row.fullName }}
                </a>
              </q-td>
              <q-td>
                {{ props.row.jobTitle }}
              </q-td>
              <q-td>
                {{ props.row.jobPosition }}
              </q-td>
              <q-td>
                {{ props.row.email }}
              </q-td>
              <q-td>
                {{ props.row.phone }}
              </q-td>
              <q-td>
                {{ props.row.address }}
              </q-td>
              <q-td>
                {{ props.row.status }}
              </q-td>
              <q-td style="text-align: center">
                <q-btn
                  dense
                  round
                  flat
                  color="red"
                  @click="removeRow(props.row)"
                  icon="delete"
                ></q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-dialog v-model="dialogSubmitInfo">
          <q-card style="min-width: 750px; padding: 0 20px 20px 20px">
            <q-card-section style="text-align: center">
              <div style="font-size: 24px; font-weight: bold">
                {{ isAdd ? "Đăng ký" : "Cập nhật" }} thông tin ứng viên
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <!-- Họ tên -->
              <div class="row item">
                <div class="col-2 title">
                  <label>Họ tên <span class="text-danger">*</span></label>
                </div>
                <div class="col-4">
                  <q-input
                    outlined
                    v-model="candidateInfo.fullName"
                    @keyup="checkValidFullName()"
                    autocomplete="off"
                  />
                  <span v-if="fullNameError != ''" class="invalid">
                    {{ fullNameError }}</span
                  >
                </div>
              </div>
              <!-- Vị trí -->
              <div class="row item">
                <div class="col-2 title">
                  <label>Vị trí <span class="text-danger">*</span></label>
                </div>
                <div class="col-10">
                  <q-select
                    outlined
                    v-model="candidateInfo.jobTitle"
                    :options="optionsTitle"
                    @blur="checkValidJobTitle()"
                    style="width: 150px"
                  />
                  <span v-if="jobTitleError != ''" class="invalid">
                    {{ jobTitleError }}</span
                  >
                </div>
              </div>
              <!-- Chức danh -->
              <div class="row item">
                <div class="col-2 title">
                  <label>Chức danh <span class="text-danger">*</span></label>
                </div>
                <div class="col-10">
                  <q-select
                    outlined
                    v-model="candidateInfo.jobPosition"
                    :options="optionsPosition"
                    @blur="checkValidJobPosition()"
                    style="width: 150px"
                  />
                  <span v-if="jobPositionError != ''" class="invalid">
                    {{ jobPositionError }}</span
                  >
                </div>
              </div>
              <!-- Email -->
              <div class="row item">
                <div class="col-2 title">
                  <label>Email <span class="text-danger">*</span></label>
                </div>
                <div class="col-4">
                  <q-input
                    outlined
                    v-model="candidateInfo.email"
                    @keyup="checkValidEmail()"
                    autocomplete="off"
                  />
                  <span v-if="emailError != ''" class="invalid">
                    {{ emailError }}</span
                  >
                </div>
              </div>
              <!-- Số điện thoại -->
              <div class="row item">
                <div class="col-2 title">
                  <label
                    >Số điện thoại <span class="text-danger">*</span></label
                  >
                </div>
                <div class="col-4">
                  <q-input
                    outlined
                    v-model="candidateInfo.phone"
                    @keyup="checkValidPhone()"
                    autocomplete="off"
                  />
                  <span v-if="phoneError != ''" class="invalid">
                    {{ phoneError }}</span
                  >
                </div>
              </div>
              <!-- Địa chỉ -->
              <div class="row item">
                <div class="col-2 title">
                  <label>Địa chỉ</label>
                </div>
                <div class="col-7">
                  <q-input
                    outlined
                    v-model="candidateInfo.address"
                    @keyup="checkValidAddress()"
                    autocomplete="off"
                  />
                  <span v-if="addressError != ''" class="invalid">
                    {{ addressError }}</span
                  >
                </div>
              </div>
              <!-- Trạng thái -->
              <div class="row item">
                <div class="col-2 title">
                  <label>Trạng thái <span class="text-danger">*</span></label>
                </div>
                <div class="col-10">
                  <q-select
                    outlined
                    v-model="candidateInfo.status"
                    :options="optionsStatus"
                    @blur="checkValidStatus()"
                    style="width: 150px"
                  />
                  <span v-if="statusError != ''" class="invalid">
                    {{ statusError }}</span
                  >
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn
                :label="isAdd ? 'Đăng ký' : 'Cập nhật'"
                color="primary"
                @click="confirmSubmit()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- dialog confirm -->
        <q-dialog v-model="dialogConfirmSubmitInfo">
          <q-card style="padding: 15px">
            <q-card-section class="row items-center">
              <span class="q-ml-sm"
                >Bạn chắc chắn muốn {{ isAdd ? "đăng ký" : "cập nhật" }}</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn label="Hủy" color="primary" v-close-popup />
              <q-btn
                :label="isAdd ? 'Đăng ký' : 'Cập nhật'"
                color="primary"
                @click="submitInfo()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { validateSelected } from "../util/common";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      REGEX_MAIL:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      REGEX_PHONE: /(84|0[3|5|7|8|9])+([0-9]{8})\b$/,
      filter: "",
      lstData: [],
      optionsTitle: ["C#", "PHP", "NodeJS"],
      optionsPosition: ["Thực tập", "Nhân viên"],
      optionsStatus: ["Nhận CV", "Duyệt CV", "Loại CV"],
      columns: [
        {
          name: "id",
          label: "ID",
          align: "center",
          field: "id",
          sortable: true,
        },
        {
          name: "fullName",
          align: "left",
          label: "Họ tên",
          field: "fullName",
        },
        {
          name: "jobTitle",
          label: "Vị trí",
          align: "left",
          field: "jobTitle",
          sortable: true,
        },
        {
          name: "jobPosition",
          align: "left",
          label: "Chức danh",
          field: "jobPosition",
          sortable: true,
        },
        {
          name: "email",
          label: "Email",
          align: "left",
          field: "email",
        },
        {
          name: "phone",
          align: "left",
          label: "Số điện thoại",
          field: "phone",
        },
        {
          name: "address",
          label: "Địa chỉ",
          align: "left",
          field: "address",
        },
        {
          name: "status",
          align: "left",
          label: "Trạng thái",
          field: "status",
          sortable: true,
        },
        {
          name: "",
          align: "center",
          label: "Hành động",
          field: "",
        },
      ],
      candidateInfo: {
        fullName: "",
        jobTitle: "",
        jobPosition: "",
        email: "",
        phone: "",
        address: "",
        status: "",
      },
      dialogSubmitInfo: false,
      dialogConfirmSubmitInfo: false,
      isAdd: false,
      fullNameError: "",
      jobTitleError: "",
      jobPositionError: "",
      emailError: "",
      phoneError: "",
      addressError: "",
      statusError: "",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.lstData = [
        {
          id: "1",
          fullName: "Hoàng Văn Đạt",
          jobTitle: "C#",
          jobPosition: "Thực tập",
          email: "dathv@gmail.com",
          phone: "0934859234",
          address: "Quảng Ninh",
          status: "Duyệt CV",
        },
        {
          id: "2",
          fullName: "Trần Ngọc Quang",
          jobTitle: "PHP",
          jobPosition: "Thực tập",
          email: "thanhphong98ls@gmail.com",
          phone: "0345873862",
          address: "Thái Nguyên",
          status: "Nhận CV",
        },
        {
          id: "3",
          fullName: "Bùi Quang Sơn",
          jobTitle: "NodeJS",
          jobPosition: "Nhân viên",
          email: "buiquangson19091998@gmail.com",
          phone: "0327670777",
          address: "Thái Bình",
          status: "Nhận CV",
        },
        {
          id: "4",
          fullName: "Nguyễn Công Cường",
          jobTitle: "PHP",
          jobPosition: "Nhân viên",
          email: "Cuongdola2283@gmail.com",
          phone: "0962893466",
          address: "Hà Nội",
          status: "Nhận CV",
        },
        {
          id: "5",
          fullName: "Đào Hải Yến",
          jobTitle: "NodeJS",
          jobPosition: "Nhân viên",
          email: "daohaiyen28895@gmail.com",
          phone: "0363631580",
          address: "Hà Nội",
          status: "Duyệt CV",
        },
      ];
    },
    // validate họ tên
    checkValidFullName() {
      if (
        this.candidateInfo.fullName === "" ||
        this.candidateInfo.fullName === undefined ||
        (this.candidateInfo.fullName.length > 0 &&
          this.candidateInfo.fullName.trim() === "")
      ) {
        this.fullNameError = "Vui lòng không để trống";
      } else if (this.candidateInfo.fullName.length > 30) {
        this.fullNameError = "Vượt quá 30 ký tự";
      } else {
        this.fullNameError = "";
      }
    },
    // validate Vị trí
    checkValidJobTitle() {
      this.jobTitleError = validateSelected(this.candidateInfo.jobTitle);
    },
    // validate Chức danh
    checkValidJobPosition() {
      this.jobPositionError = validateSelected(this.candidateInfo.jobPosition);
    },
    // validate email
    checkValidEmail() {
      if (
        this.candidateInfo.email === "" ||
        this.candidateInfo.email === undefined ||
        (this.candidateInfo.email.length > 0 &&
          this.candidateInfo.email.trim() === "")
      ) {
        this.emailError = "Vui lòng không để trống";
      } else if (this.candidateInfo.email.length > 50) {
        this.emailError = "Vượt quá 50 ký tự";
      } else if (!new RegExp(this.REGEX_MAIL).test(this.candidateInfo.email)) {
        this.emailError = "Email không đúng định dạng";
      } else {
        this.emailError = "";
      }
    },
    // validate số điện thoại
    checkValidPhone() {
      if (
        this.candidateInfo.phone === "" ||
        this.candidateInfo.phone === undefined ||
        (this.candidateInfo.phone.length > 0 &&
          this.candidateInfo.phone.trim() === "")
      ) {
        this.phoneError = "Vui lòng không để trống";
      } else if (this.candidateInfo.phone.length != 10) {
        this.phoneError = "Số điện thoại là 10 ký tự";
      } else if (!new RegExp(this.REGEX_PHONE).test(this.candidateInfo.phone)) {
        this.phoneError = "Số điện thoại không đúng định dạng";
      } else {
        this.phoneError = "";
      }
    },
    // validate địa chỉ
    checkValidAddress() {
      if (
        this.candidateInfo.address !== null &&
        this.candidateInfo.address !== "" &&
        this.candidateInfo.address !== undefined &&
        this.candidateInfo.address.length > 0 &&
        this.candidateInfo.address.trim() !== "" &&
        this.candidateInfo.address.length > 100
      ) {
        this.addressError = "Vượt quá 100 ký tự";
      } else {
        this.addressError = "";
      }
    },
    // validate trạng thái
    checkValidStatus() {
      this.statusError = validateSelected(this.candidateInfo.status);
    },
    openDialogInfo(item, isAdd) {
      this.candidateInfo = {};
      this.clearMessageError();

      this.isAdd = isAdd;
      if (!isAdd) {
        this.candidateInfo = { ...item };
      }

      this.dialogSubmitInfo = true;
    },
    confirmSubmit() {
      if (this.isValidateAll()) {
        this.dialogConfirmSubmitInfo = true;
      }
    },
    submitInfo() {
      this.dialogSubmitInfo = false;
      this.dialogConfirmSubmitInfo = false;
      if (this.isAdd) {
        this.candidateInfo.id = this.lstData.length + 1;
        this.lstData.push(this.candidateInfo);
        this.isAdd = false;
      } else {
        var index = this.lstData.findIndex(
          (x) => x.id === this.candidateInfo.id
        );
        if (index != -1) {
          this.lstData[index] = this.candidateInfo;
        }
      }
    },
    removeRow(item) {
      const index = this.lstData.findIndex((x) => x.id === item.id);
      this.lstData.splice(index, 1);
    },
    isValidateAll() {
      this.checkValidFullName();
      this.checkValidJobTitle();
      this.checkValidJobPosition();
      this.checkValidEmail();
      this.checkValidPhone();
      this.checkValidAddress();
      this.checkValidStatus();

      if (
        this.fullNameError == "" &&
        this.jobTitleError == "" &&
        this.jobPositionError == "" &&
        this.emailError == "" &&
        this.phoneError == "" &&
        this.addressError == "" &&
        this.statusError == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    clearMessageError() {
      this.fullNameError = "";
      this.jobTitleError = "";
      this.jobPositionError = "";
      this.emailError = "";
      this.phoneError = "";
      this.addressError = "";
      this.statusError = "";
    },
  },
});
</script>

<style scoped>
.content {
  width: 70%;
  margin: auto;
}

.content h3 {
  text-align: center;
}

.item {
  margin-bottom: 7px;
}

.title {
  font-weight: bold;
  line-height: 56px;
}

.router {
  text-decoration: underline;
  color: blue;
  font-weight: bold;
  cursor: pointer;
}

.invalid {
  color: red;
  margin: 7px 0;
  display: block;
}

.text-danger {
  color: red;
}

.q-td {
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100px;
  overflow: hidden;
}
</style>
