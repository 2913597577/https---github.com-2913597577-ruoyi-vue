<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入员工姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="部门id" prop="deptId">
              <el-input v-model="queryParams.deptId" placeholder="请输入部门id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="职位id" prop="positionId">
              <el-input v-model="queryParams.positionId" placeholder="请输入职位id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="职务" prop="positionName">
              <el-input v-model="queryParams.positionName" placeholder="请输入职务" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="职级" prop="positionRank">
              <el-input v-model="queryParams.positionRank" placeholder="请输入职级" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="工作地点" prop="workLocation">
              <el-input v-model="queryParams.workLocation" placeholder="请输入工作地点" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="工作团队" prop="team">
              <el-input v-model="queryParams.team" placeholder="请输入工作团队" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['staffInfo:staffInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['staffInfo:staffInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['staffInfo:staffInfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['staffInfo:staffInfo:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="staffInfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="员工姓名" align="center" prop="name" />
        <el-table-column label="电子邮箱" align="center" prop="email" />
        <el-table-column label="手机号码" align="center" prop="mobile" />
        <el-table-column label="性别" align="center" prop="sex" />
        <el-table-column label="别名" align="center" prop="nickname" />
        <el-table-column label="员工照片" align="center" prop="thumb" />
        <el-table-column label="部门id" align="center" prop="deptId" />
        <el-table-column label="上级主管id" align="center" prop="pid" />
        <el-table-column label="职位id" align="center" prop="positionId" />
        <el-table-column label="职务" align="center" prop="positionName" />
        <el-table-column label="职级" align="center" prop="positionRank" />
        <el-table-column label="员工类型" align="center" prop="type" />
        <el-table-column label="身份类型" align="center" prop="isStaff" />
        <el-table-column label="工号" align="center" prop="jobNumber" />
        <el-table-column label="生日" align="center" prop="birthday" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="开始工作时间" align="center" prop="workDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.workDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工作地点" align="center" prop="workLocation" />
        <el-table-column label="工作团队" align="center" prop="team" />
        <el-table-column label="籍贯" align="center" prop="nativePlace" />
        <el-table-column label="民族" align="center" prop="nation" />
        <el-table-column label="家庭地址" align="center" prop="homeAddress" />
        <el-table-column label="现居地址" align="center" prop="currentAddress" />
        <el-table-column label="紧急联系人" align="center" prop="contact" />
        <el-table-column label="紧急联系人电话" align="center" prop="contactMobile" />
        <el-table-column label="户口性质" align="center" prop="residentType" />
        <el-table-column label="户口所在地" align="center" prop="residentPlace" />
        <el-table-column label="毕业学校" align="center" prop="graduateSchool" />
        <el-table-column label="毕业日期" align="center" prop="graduateDay" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.graduateDay, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="政治面貌" align="center" prop="political" />
        <el-table-column label="婚姻状况" align="center" prop="maritalStatus" />
        <el-table-column label="身份证" align="center" prop="idcard" />
        <el-table-column label="学位" align="center" prop="education" />
        <el-table-column label="专业" align="center" prop="speciality" />
        <el-table-column label="社保账号" align="center" prop="socialAccount" />
        <el-table-column label="医保账号" align="center" prop="medicalAccount" />
        <el-table-column label="公积金账号" align="center" prop="providentAccount" />
        <el-table-column label="银行卡号" align="center" prop="bankAccount" />
        <el-table-column label="开户行" align="center" prop="bankInfo" />
        <el-table-column label="档案附件" align="center" prop="fileIds" />
        <el-table-column label="员工个人简介" align="center" prop="description" />
        <el-table-column label="员工入职日期" align="center" prop="entryTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.entryTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工离职日期" align="center" prop="levelTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.levelTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['staffInfo:staffInfo:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['staffInfo:staffInfo:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改员工档案对话框 -->
    <!-- 替换原有的 el-dialog 部分 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body :close-on-click-modal="false"
      :destroy-on-close="true">
      <!-- 外层卡片：添加边框与阴影，统一视觉容器 -->
      <el-card class="staff-form-card" shadow="always" border>
        <el-form ref="staffInfoFormRef" :model="form" :rules="rules" label-width="120px" inline-message size="medium">
          <!-- 1. 基础信息组：核心身份信息 -->
          <div class="form-group">
            <h3 class="group-title">基础信息</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="员工姓名" prop="name" class="form-item">
                  <el-input v-model="form.name" placeholder="请输入员工姓名" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户id" prop="userId" class="form-item">
                  <el-input v-model="form.userId" placeholder="请输入用户id" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="电子邮箱" prop="email" class="form-item">
                  <el-input v-model="form.email" placeholder="请输入电子邮箱" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="mobile" class="form-item">
                  <el-input v-model="form.mobile" placeholder="请输入手机号码" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="性别" prop="sex" class="form-item">
                  <!-- 优化：将输入框改为下拉选择，避免手动输入不一致 -->
                  <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                    <el-option label="其他" value="其他"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="别名" prop="nickname" class="form-item">
                  <el-input v-model="form.nickname" placeholder="请输入别名" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 2. 工作信息组：与岗位/任职相关 -->
          <div class="form-group">
            <h3 class="group-title">工作信息</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="部门id" prop="deptId" class="form-item">
                  <el-input v-model="form.deptId" placeholder="请输入部门id" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职位id" prop="positionId" class="form-item">
                  <el-input v-model="form.positionId" placeholder="请输入职位id" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="职务" prop="positionName" class="form-item">
                  <el-input v-model="form.positionName" placeholder="请输入职务" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职级" prop="positionRank" class="form-item">
                  <el-input v-model="form.positionRank" placeholder="请输入职级" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="工号" prop="jobNumber" class="form-item">
                  <el-input v-model="form.jobNumber" placeholder="请输入工号" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="员工类型" prop="type" class="form-item">
                  <el-select v-model="form.type" placeholder="请选择员工类型" style="width: 100%">
                    <el-option label="正式员工" value="正式员工"></el-option>
                    <el-option label="实习生" value="实习生"></el-option>
                    <el-option label="外包" value="外包"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="开始工作时间" prop="workDate" class="form-item">
                  <el-date-picker clearable v-model="form.workDate" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择开始工作时间" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作地点" prop="workLocation" class="form-item">
                  <el-input v-model="form.workLocation" placeholder="请输入工作地点" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="工作团队" prop="team" class="form-item">
                  <el-input v-model="form.team" placeholder="请输入工作团队" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份类型" prop="isStaff" class="form-item">
                  <el-select v-model="form.isStaff" placeholder="请选择身份类型" style="width: 100%">
                    <el-option label="未设置" value="0"></el-option>
                    <el-option label="企业员工" value="1"></el-option>
                    <el-option label="劳务派遣" value="2"></el-option>
                    <el-option label="兼职员工" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 3. 入职离职信息组：时间维度相关 -->
          <div class="form-group">
            <h3 class="group-title">入职离职信息</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="员工入职日期" prop="entryTime" class="form-item">
                  <el-date-picker clearable v-model="form.entryTime" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择员工入职日期" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="员工离职日期" prop="levelTime" class="form-item">
                  <el-date-picker clearable v-model="form.levelTime" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择员工离职日期" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 4. 个人详情组：身份与生活属性 -->
          <div class="form-group">
            <h3 class="group-title">个人详情</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="生日" prop="birthday" class="form-item">
                  <el-date-picker clearable v-model="form.birthday" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择生日" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄" prop="age" class="form-item">
                  <el-input-number v-model="form.age" placeholder="请输入年龄" :min="0" :max="150" controls-position="right"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="籍贯" prop="nativePlace" class="form-item">
                  <el-input v-model="form.nativePlace" placeholder="请输入籍贯" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族" prop="nation" class="form-item">
                  <el-input v-model="form.nation" placeholder="请输入民族" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="政治面貌" prop="political" class="form-item">
                  <el-select v-model="form.political" placeholder="请选择政治面貌" style="width: 100%">
                    <el-option label="未设置" value="0"></el-option>
                    <el-option label="中共党员" value="1"></el-option>
                    <el-option label="团员" value="2"></el-option>
                    <el-option label="群众" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="婚姻状况" prop="maritalStatus" class="form-item">
                  <el-select v-model="form.maritalStatus" placeholder="请选择婚姻状况" style="width: 100%">
                    <el-option label="未婚" value="未婚"></el-option>
                    <el-option label="已婚" value="已婚"></el-option>
                    <el-option label="离异" value="离异"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="家庭地址" prop="homeAddress" class="form-item">
                  <el-input v-model="form.homeAddress" placeholder="请输入家庭地址" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现居地址" prop="currentAddress" class="form-item">
                  <el-input v-model="form.currentAddress" placeholder="请输入现居地址" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="紧急联系人" prop="contact" class="form-item">
                  <el-input v-model="form.contact" placeholder="请输入紧急联系人" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="紧急联系人电话" prop="contactMobile" class="form-item">
                  <el-input v-model="form.contactMobile" placeholder="请输入紧急联系人电话" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 5. 学历信息组：教育背景 -->
          <div class="form-group">
            <h3 class="group-title">学历信息</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="学位" prop="education" class="form-item">
                  <el-select v-model="form.education" placeholder="请选择学位" style="width: 100%">
                    <el-option label="小学" value="小学"></el-option>
                    <el-option label="初中" value="初中"></el-option>
                    <el-option label="高中" value="高中"></el-option>
                    <el-option label="专科" value="专科"></el-option>
                    <el-option label="本科" value="本科"></el-option>
                    <el-option label="硕士" value="硕士"></el-option>
                    <el-option label="博士" value="博士"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专业" prop="speciality" class="form-item">
                  <el-input v-model="form.speciality" placeholder="请输入专业" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="毕业学校" prop="graduateSchool" class="form-item">
                  <el-input v-model="form.graduateSchool" placeholder="请输入毕业学校" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毕业日期" prop="graduateDay" class="form-item">
                  <el-date-picker clearable v-model="form.graduateDay" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择毕业日期" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 6. 证件与账号组：官方凭证信息 -->
          <div class="form-group">
            <h3 class="group-title">证件与账号信息</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="身份证" prop="idcard" class="form-item">
                  <el-input v-model="form.idcard" placeholder="请输入身份证号" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户口性质" prop="residentType" class="form-item">
                  <el-select v-model="form.residentType" placeholder="请选择户口性质" style="width: 100%">
                    <el-option label="农业户口" value="农业户口"></el-option>
                    <el-option label="非农业户口" value="非农业户口"></el-option>
                    <el-option label="居民户口" value="居民户口"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="户口所在地" prop="residentPlace" class="form-item">
                  <el-input v-model="form.residentPlace" placeholder="请输入户口所在地" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社保账号" prop="socialAccount" class="form-item">
                  <el-input v-model="form.socialAccount" placeholder="请输入社保账号" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="医保账号" prop="medicalAccount" class="form-item">
                  <el-input v-model="form.medicalAccount" placeholder="请输入医保账号" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公积金账号" prop="providentAccount" class="form-item">
                  <el-input v-model="form.providentAccount" placeholder="请输入公积金账号" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
              <el-col :span="12">
                <el-form-item label="银行卡号" prop="bankAccount" class="form-item">
                  <el-input v-model="form.bankAccount" placeholder="请输入银行卡号" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开户行" prop="bankInfo" class="form-item">
                  <el-input v-model="form.bankInfo" placeholder="请输入开户行（如：工行XX支行）" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 7. 个人简介组：长文本信息 -->
          <div class="form-group">
            <h3 class="group-title">个人简介</h3>
            <el-row :gutter="20" class="form-row">
              <el-col :span="24">
                <el-form-item label="员工个人简介" prop="desc" class="form-item-full">
                  <el-input v-model="form.desc" type="textarea" placeholder="请输入员工个人简介（如工作经历、技能特长等）" :rows="4"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>

      <!-- 底部按钮区域：保持居中对齐 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm" size="medium">确 定</el-button>
          <el-button @click="cancel" size="medium">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="StaffInfo" lang="ts">
import { listStaffInfo, getStaffInfo, delStaffInfo, addStaffInfo, updateStaffInfo } from '@/api/staffInfo/staffInfo';
import { StaffInfoVO, StaffInfoQuery, StaffInfoForm } from '@/api/staffInfo/staffInfo/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const staffInfoList = ref<StaffInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const staffInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: StaffInfoForm = {
  id: undefined,
  userId: undefined,
  name: undefined,
  email: undefined,
  mobile: undefined,
  sex: undefined,
  nickname: undefined,
  thumb: undefined,
  deptId: undefined,
  pid: undefined,
  positionId: undefined,
  positionName: undefined,
  positionRank: undefined,
  type: undefined,
  isStaff: undefined,
  jobNumber: undefined,
  birthday: undefined,
  age: undefined,
  workDate: undefined,
  workLocation: undefined,
  team: undefined,
  nativePlace: undefined,
  nation: undefined,
  homeAddress: undefined,
  currentAddress: undefined,
  contact: undefined,
  contactMobile: undefined,
  residentType: undefined,
  residentPlace: undefined,
  graduateSchool: undefined,
  graduateDay: undefined,
  political: undefined,
  maritalStatus: undefined,
  idcard: undefined,
  education: undefined,
  speciality: undefined,
  socialAccount: undefined,
  medicalAccount: undefined,
  providentAccount: undefined,
  bankAccount: undefined,
  bankInfo: undefined,
  fileIds: undefined,
  description: undefined,
  entryTime: undefined,
  levelTime: undefined,
  status: undefined,
}
const data = reactive<PageData<StaffInfoForm, StaffInfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    name: undefined,
    sex: undefined,
    deptId: undefined,
    positionId: undefined,
    positionName: undefined,
    positionRank: undefined,
    workLocation: undefined,
    team: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "自增主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询员工档案列表 */
const getList = async () => {
  loading.value = true;
  const res = await listStaffInfo(queryParams.value);
  staffInfoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  staffInfoFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: StaffInfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加员工档案";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: StaffInfoVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getStaffInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改员工档案";
}

/** 提交按钮 */
const submitForm = () => {
  staffInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateStaffInfo(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addStaffInfo(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: StaffInfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除员工档案编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delStaffInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('staffInfo/staffInfo/export', {
    ...queryParams.value
  }, `staffInfo_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
<style scoped>
/* 外层卡片样式：边框、阴影、内边距 */
.staff-form-card {
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e6e6e6;
}

/* 分组容器：底部虚线分割，间距控制 */
.form-group {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px dashed #f0f0f0;
}

/* 最后一个分组去掉底部分割线 */
.form-group:last-child {
  border-bottom: none;
  margin-bottom: 10px;
  padding-bottom: 0;
}

/* 分组标题：左侧主题色小条+文字样式 */
.group-title {
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.group-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: #1890ff;
  border-radius: 2px;
  margin-right: 8px;
}

/* 行布局：统一间距 */
.form-row {
  margin-bottom: 14px;
}

/* 表单项：避免拥挤 */
.form-item {
  margin-bottom: 0;
}

/* 全屏宽度表单项 */
.form-item-full {
  margin-bottom: 0;
}

/* 底部按钮区域：居中对齐 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  /* 按钮间距 */
}

/* 按钮样式优化：最小宽度保证一致性 */
.dialog-footer .el-button {
  min-width: 90px;
}
</style>