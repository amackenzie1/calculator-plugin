class Wisely_Surplus_Calculator_Public
{

    public function general_get_data($local_stored_data)
    {

        $donate_arr = $_POST['local_stored_data']['step_8']['donate_plan_no_main'];
        $donate_arr = implode("-", $donate_arr);
        $donate_arr = explode("-", $donate_arr);
        $donate_start_date = $donate_arr[0];
        $donate_end_date = $donate_arr[1];

        $donate_plain_arr = $_POST['local_stored_data']['step_8']['donate_plan_no_spouse'];
        $donate_plain_arr = implode("-", $donate_plain_arr);
        $donate_plain_arr = explode("-", $donate_plain_arr);
        $donate_plain_start = $donate_arr[0];
        $donate_plain_end = $donate_arr[1];

        $oneoff_expense_arr = $_POST['local_stored_data']['step_8']['oneoff_expense_main'];
        $oneoff_expense_arr = implode("-", $oneoff_expense_arr);
        $oneoff_expense_arr = explode("-", $oneoff_expense_arr);
        $oneoff_start = $oneoff_expense_arr[0];
        $oneoff_end = $oneoff_expense_arr[1];

        $oneoff_expense_s_arr = $_POST['local_stored_data']['step_8']['oneoff_expense_spouse'];
        $oneoff_expense_s_arr = implode("-", $oneoff_expense_s_arr);
        $oneoff_expense_s_arr = explode("-", $oneoff_expense_s_arr);
        $oneoff_start_s = $oneoff_expense_s_arr[0];
        $oneoff_end_s = $oneoff_expense_s_arr[1];


        $data  = array(
            'local_stored_data' => $_POST['local_stored_data'],
            'local_old_are' => $_POST['local_stored_data']['step_1']['old_are'],
            'local_info_are' => $_POST['local_stored_data']['step_1']['info_are'],
            'local_estimate_expect' => $_POST['local_stored_data']['step_1']['estimate_expect'],
            'local_live' => $_POST['local_stored_data']['step_1']['live'],
            'local_life_expect' => $_POST['local_stored_data']['step_1']['life_expect'],
            'local_live_spouse' => $_POST['local_stored_data']['step_1']['live'],
            'local_est_with_spouse' => $_POST['local_stored_data']['step_1']['est_with_spouse'],
            'local_inflation_rate' => $_POST['local_stored_data']['step_2']['inflation_rate'],
            'local_investor_main' => $_POST['local_stored_data']['step_2']['investor_main'],
            'local_income_rate' => $_POST['local_stored_data']['step_2']['income_rate'],
            'local_growth_rate' => $_POST['local_stored_data']['step_2']['growth_rate'],
            'local_specify_return' => $_POST['local_stored_data']['step_2']['specify_return'],
            'local_your_income' => $_POST['local_stored_data']['step_3']['your_income'],
            'local_spouse_income' => $_POST['local_stored_data']['step_3']['spouse_income'],
            'local_your_date' => $_POST['local_stored_data']['step_3']['your_date'],
            'local_start_date' => $_POST['local_stored_data']['step_3']['start_date'],
            'local_end_date' => $_POST['local_stored_data']['step_3']['end_date'],
            'local_spouse_date' => $_POST['local_stored_data']['step_3']['spouse_date'],
            'local_spouse_start_date' => $_POST['local_stored_data']['step_3']['spouse_start_date'],
            'local_spouse_end_date' => $_POST['local_stored_data']['step_3']['spouse_end_date'],
            'local_other_date' => $_POST['local_stored_data']['step_3']['other_date'],
            'local_other_income' => $_POST['local_stored_data']['step_3']['other_income'],
            'local_other_spouse_income' => $_POST['local_stored_data']['step_3']['other_spouse_income'],
            'local_other_spouse_date' => $_POST['local_stored_data']['step_3']['other_spouse_date'],
            //CPP localstorage data
            'local_ps_spouse_age' => $_POST['local_stored_data']['step_4']['pension_sn_age'],
            'local_pension_age' => $_POST['local_stored_data']['step_4']['pension_age'],
            'local_pension_amount' => $_POST['local_stored_data']['step_4']['pension_amount'],
            'local_pension_sn_amount' => $_POST['local_stored_data']['step_4']['pension_sn_amount'],

            //OAS localstorage data
            'local_sc_spouse_age' => $_POST['local_stored_data']['step_4']['sc_spouse_age'],
            'local_security_sn_age' => $_POST['local_stored_data']['step_4']['security_sn_age'],
            'local_security_age' => $_POST['local_stored_data']['step_4']['security_age'],
            'local_security_amount' => $_POST['local_stored_data']['step_4']['security_amount'],
            'local_security_sn_amount' => $_POST['local_stored_data']['step_4']['security_sn_amount'],

            //Defined Benefit Pension localstorage data
            'local_bp_spouse_age' => $_POST['local_stored_data']['step_4']['bp_spouse_age'],
            'local_benifit_amount' => $_POST['local_stored_data']['step_4']['benifit_amount'],
            'local_benifit_sn_amount' => $_POST['local_stored_data']['step_4']['benifit_sn_amount'],
            //'local_index_spouse_age' => $_POST['local_stored_data']['step_4']['index_spouse_age'],
            'local_indexed_to_inflatiton' => $_POST['local_stored_data']['step_4']['indexed_to_inflatiton'],
            'local_indexed_to_inflatiton_spouse' => $_POST['local_stored_data']['step_4']['indexed_to_inflatiton_spouse'],
            'local_start_rec_pay_cpp_qpp' => $_POST['local_stored_data']['step_4']['start_rec_pay_cpp_qpp'],
            'local_start_rec_pay_cpp_qpp_spouse' => $_POST['local_stored_data']['step_4']['start_rec_pay_cpp_qpp_spouse'],
            'local_start_OAS_pay' => $_POST['local_stored_data']['step_4']['start_OAS_pay'],
            'local_start_OAS_pay_spouse' => $_POST['local_stored_data']['step_4']['start_OAS_pay_spouse'],
            'local_start_def_ben_pens' => $_POST['local_stored_data']['step_4']['start_def_ben_pens'],
            'local_start_def_ben_pens_spouse' => $_POST['local_stored_data']['step_4']['start_def_ben_pens_spouse'],
            'local_benifit_age' => $_POST['local_stored_data']['step_4']['benifit_age'],
            'local_benifit_sn_age' => $_POST['local_stored_data']['step_4']['benifit_sn_age'],
            //Health Care Expense localstorage data
            'local_annual_expense' => $_POST['local_stored_data']['step_7']['annual_expense'],
            'local_care_expense' => $_POST['local_stored_data']['step_7']['care_expense'],
            'local_se_annual_expense' => $_POST['local_stored_data']['step_7']['se_annual_expense'],
            'local_se_care_expense' => $_POST['local_stored_data']['step_7']['se_care_expense'],
            'local_expe_each_stage_ret' => $_POST['local_stored_data']['step_7']['expe_each_stage_ret'],
            'local_expe_each_stage_ret_spouse' => $_POST['local_stored_data']['step_7']['expe_each_stage_ret_spouse'],

            //Core_Needs localstorage data
            'local_annual_expense' => $_POST['local_stored_data']['step_7']['annual_expense'],
            'local_care_expense' => $_POST['local_stored_data']['step_7']['care_expense'],
            'local_se_annual_expense' => $_POST['local_stored_data']['step_7']['se_annual_expense'],
            'local_se_care_expense' => $_POST['local_stored_data']['step_7']['se_care_expense'],
            'local_annual_age' => $_POST['local_stored_data']['step_7']['annual_age'],
            'local_care_age' => $_POST['local_stored_data']['step_7']['care_age'],
            'local_second_annual_age' => $_POST['local_stored_data']['step_7']['second_annual_age'],
            'local_second_care_age' => $_POST['local_stored_data']['step_7']['second_care_age'],
            'local_third_annual_age' => $_POST['local_stored_data']['step_7']['third_annual_age'],
            'local_third_care_age' => $_POST['local_stored_data']['step_7']['third_care_age'],

            'local_spouse_annual' => $_POST['local_stored_data']['step_7']['spouse_annual_age'],
            'local_spouse_care' => $_POST['local_stored_data']['step_7']['spouse_care_age'],

            'local_spouse_se_annual' => $_POST['local_stored_data']['step_7']['spouse_se_annual_age'],
            'local_spouse_se_care' => $_POST['local_stored_data']['step_7']['spouse_se_care_age'],
            'local_spouse_th_annual' => $_POST['local_stored_data']['step_7']['spouse_th_annual_age'],
            'local_spouse_th_care_age' => $_POST['local_stored_data']['step_7']['spouse_th_care_age'],

            //charitable donations localstorage data
            'local_donate_plan_no_main' => $_POST['local_stored_data']['step_8']['donate_plan_no_main'],
            'local_donate_plan_main' => $_POST['local_stored_data']['step_8']['donate_plan_main'],
            'local_donate_plan_no_spouse' => $_POST['local_stored_data']['step_8']['donate_plan_no_spouse'],
            'local_donate_plan_spouse' => $_POST['local_stored_data']['step_8']['donate_plan_spouse'],

            //Discretionary Spending localstorage data
            'local_expense_type_main_val' => $_POST['local_stored_data']['step_8']['expense_type_main_val'],
            'local_expense_type_spouse_val' => $_POST['local_stored_data']['step_8']['expense_type_spouse_val'],
            'local_oneoff_expense_main' => $_POST['local_stored_data']['step_8']['oneoff_expense_main'],
            'local_oneoff_expense_spouse' => $_POST['local_stored_data']['step_8']['oneoff_expense_spouse'],

            //Desired Estate localstorage data
            'local_desired_estate' => $_POST['local_stored_data']['step_8']['desired_estate_main'],

            //Life Insurance localstorage data
            'local_estate_value' => $_POST['local_stored_data']['step_5']['estate_value'],
            'local_se_estate_value' => $_POST['local_stored_data']['step_5']['se_estate_value'],

            //Primary Residence localstorage data
            'local_Primary_value' => $_POST['local_stored_data']['step_6']['primary_value'],
            'local_plan_return' => $_POST['local_stored_data']['step_6']['plan_return'],

            //assets localstorage data			
            'local_spouse_value' => $_POST['local_stored_data']['step_5']['spouse_value'],
            'local_account_value' => $_POST['local_stored_data']['step_5']['account_value'],
            'local_ct_account_value' => $_POST['local_stored_data']['step_5']['ct_account_value'],
            'local_st_account_value' => $_POST['local_stored_data']['step_5']['st_account_value'],
            'local_ct_book_value' => $_POST['local_stored_data']['step_5']['ct_book_value'],
            'local_st_book_value' => $_POST['local_stored_data']['step_5']['st_book_value'],
        );
        //client
        $asset_account_main_array = $_POST['local_stored_data']['step_5']['account_main'];
        $asset_account_value_array =  array_map("floatval", str_replace(array("$", ","), "", $_POST['local_stored_data']['step_5']['account_value']));


        $account_main_value_combine  = array_combine($asset_account_main_array, $asset_account_value_array);

        if (!array_key_exists("TFSA", $account_main_value_combine)) {
            $account_main_value_combine['TFSA'] = floatval(0);
        }
        if (!array_key_exists("RRSP", $account_main_value_combine)) {
            $account_main_value_combine['RRSP'] = floatval(0);
        }
        if (!array_key_exists("RRIF", $account_main_value_combine)) {
            $account_main_value_combine['RRIF'] = floatval(0);
        }
        if (!array_key_exists("LIRA", $account_main_value_combine)) {
            $account_main_value_combine['LIRA'] = floatval(0);
        }
        if (!array_key_exists("LIF", $account_main_value_combine)) {
            $account_main_value_combine['LIF'] = floatval(0);
        }


        $account_main_value_combine["NON_REGISTERED_ASSET"] = floatval(str_replace(array("$", ","), "", $data['local_ct_account_value']));
        $account_main_value_combine["NON_REGISTERED_BOOK_VALUE"] = floatval(str_replace(array("$", ","), "", $data['local_ct_book_value']));

        //spouse
        $asset_account_main_spouse_array = $_POST['local_stored_data']['step_5']['spouse_main'];
        $asset_account_value_spouse_array =  array_map("floatval", str_replace(array("$", ","), "", $_POST['local_stored_data']['step_5']['spouse_value']));

        $account_main_value_spouse_combine  = array_combine($asset_account_main_spouse_array, $asset_account_value_spouse_array);
        if (!array_key_exists("TFSA", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['TFSA'] = floatval(0);
        }
        if (!array_key_exists("RRSP", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['RRSP'] = floatval(0);
        }
        if (!array_key_exists("RRIF", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['RRIF'] = floatval(0);
        }
        if (!array_key_exists("LIRA", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['LIRA'] = floatval(0);
        }
        if (!array_key_exists("LIF", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['LIF'] = floatval(0);
        }

        $account_main_value_spouse_combine["NON_REGISTERED_ASSET"] = floatval(str_replace(array("$", ","), "", $data['local_st_account_value']));
        $account_main_value_spouse_combine["NON_REGISTERED_BOOK_VALUE"] = floatval(str_replace(array("$", ","), "", $data['local_st_book_value']));

        //$start_year = 2023;
        $start_year = (int) date('Y');
        $client_rem_years = (int) $data['local_life_expect'] - (int)$data['local_old_are'];
        $end_year = (int) $start_year + (int) $client_rem_years;
        $spouse_rem_years = (int) $data['local_estimate_expect'] - (int)$data['local_info_are'];
        $end_year_spouse = (int) $start_year + (int) $spouse_rem_years;


        /* pension startdate calculation start */

        $local_start_rec_pay_cpp_qpp = $data['local_start_rec_pay_cpp_qpp'];
        $local_start_rec_pay_cpp_qpp_spouse = $data['local_start_rec_pay_cpp_qpp_spouse'];
        if ($local_start_rec_pay_cpp_qpp == 'yes') {
            $start_year_pension = $start_year;
            $end_year_pension = $end_year;
        } else {

            $local_pension_age = $data['local_pension_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_pension = (int) $local_pension_age - (int) $local_old_are;
            $start_year_pension = $start_year + $remain_years_of_pension;
            $end_year_pension = $end_year;
        }

        if ($local_start_rec_pay_cpp_qpp_spouse == 'yes') {

            $start_year_pension_spouse = $start_year;
            $end_year_pension_spouse = $end_year_spouse;
        } else {

            $local_ps_spouse_age = $data['local_ps_spouse_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_pension_spouse = (int) $local_ps_spouse_age - (int) $local_info_are;
            $start_year_pension_spouse = $start_year + $remain_years_of_pension_spouse;
            $end_year_pension_spouse = $end_year_spouse;
        }

        /* pension startdate calculation end */
        /* OAS startdate calculation start */

        $local_start_OAS_pay = $data['local_start_OAS_pay'];
        $local_start_OAS_pay_spouse = $data['local_start_OAS_pay_spouse'];

        if ($local_start_OAS_pay == 'yes') {

            $start_year_OAS = $start_year;
            $end_year_OAS = $end_year;
        } else {

            $local_security_age = $data['local_security_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_OAS = (int) $local_security_age - (int) $local_old_are;
            $start_year_OAS = $start_year + $remain_years_of_OAS;
            $end_year_OAS = $end_year;
        }
        if ($local_start_OAS_pay_spouse == 'yes') {

            $start_year_OAS_spouse = $start_year;
            $end_year_OAS_spouse = $end_year_spouse;
        } else {

            $local_security_sn_age = $data['local_security_sn_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_OAS_spouse = (int) $local_security_sn_age - (int) $local_info_are;
            $start_year_OAS_spouse = $start_year + $remain_years_of_OAS_spouse;
            $end_year_OAS_spouse = $end_year_spouse;
        }

        /* OAS startdate calculation end */
        /* Defined Benefit Pension startdate calculation start */

        $local_start_def_ben_pens = $data['local_start_def_ben_pens'];
        $local_start_def_ben_pens_spouse = $data['local_start_def_ben_pens_spouse'];

        if ($local_start_def_ben_pens == 'yes') {

            $start_year_DBP = $start_year;
            $end_year_DBP = $end_year;
        } else {

            $local_benifit_age = $data['local_benifit_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_DBP = (int) $local_benifit_age - (int) $local_old_are;
            $start_year_DBP = $start_year + $remain_years_of_DBP;
            $end_year_DBP = $end_year;
        }

        if ($local_start_def_ben_pens_spouse == 'yes') {

            $start_year_DBP_spouse = $start_year;
            $end_year_DBP_spouse = $end_year_spouse;
        } else {

            $local_benifit_sn_age = $data['local_benifit_sn_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_DBP_spouse = (int) $local_benifit_sn_age - (int) $local_info_are;
            $start_year_DBP_spouse = $start_year + $remain_years_of_DBP_spouse;
            $end_year_DBP_spouse = $end_year_spouse;
        }
        /* Defined Benefit Pension startdate calculation end */


        $pension_arr = [
            [
                "person" => "client",
                "name" => "CPP",
                "start_year" => $start_year_pension,
                "end_year" => $end_year_pension,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_pension_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "client",
                "name" => "OAS",
                "start_year" => $start_year_OAS,
                "end_year" => $end_year_OAS,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_security_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "client",
                "name" => "OTHER_PENSION",
                "start_year" => $start_year_DBP,
                "end_year" => $end_year_DBP,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_benifit_amount'])),
                "index_rate" => ($data['local_indexed_to_inflatiton'] == 'yes') ? floatval($data['local_inflation_rate'] / 100) : 0.00,
            ],
        ];

        $pension_spouse_arr =  [
            [
                "person" => "spouse",
                "name" => "CPP",
                "start_year" => $start_year_pension_spouse,
                "end_year" => $end_year_pension_spouse,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_pension_sn_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "spouse",
                "name" => "OTHER_PENSION",
                "start_year" => $start_year_DBP_spouse,
                "end_year" => $end_year_DBP_spouse,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_benifit_sn_amount'])),
                "index_rate" => ($data['local_indexed_to_inflatiton_spouse'] == 'yes') ? floatval($data['local_inflation_rate'] / 100) : 0.00,
            ],
            [
                "person" => "spouse",
                "name" => "OAS",
                "start_year" => $start_year_OAS_spouse,
                "end_year" => $end_year_OAS_spouse,
                "amount" =>  floatval(str_replace(array("$", ","), "", $data['local_security_sn_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],

        ];

        if ($data['local_est_with_spouse'] == 'yes') {

            $pension_arr = array_merge($pension_arr, $pension_spouse_arr);
        }

        /* expense startyear calculation start */

        $local_expe_each_stage_ret = $data['local_expe_each_stage_ret'];
        $local_expe_each_stage_ret_spouse = $data['local_expe_each_stage_ret_spouse'];
        if ($local_expe_each_stage_ret == 'yes') {

            $core_needs_expe_start_year = $start_year;

            $remain_years_upto_75 = 75 - (int)$data['local_old_are'];

            $core_needs_expe_end_year = $start_year + $remain_years_upto_75;


            /* 76 to 85 */

            $core_needs_expe_start_year_76_85 = $core_needs_expe_end_year + 1;

            $remain_years_upto_85 = 85 - (int)$data['local_old_are'];

            $core_needs_expe_end_year_76_85 = $start_year + $remain_years_upto_85;


            /* 86 to life exp year */

            $core_needs_expe_start_year_86_life = $core_needs_expe_end_year_76_85 + 1;

            $remain_years_upto_life = (int) $data['local_life_expect'] - (int)$data['local_old_are'];

            $core_needs_expe_end_year_86_life = $start_year + $remain_years_upto_life;
        } else {

            $core_needs_expe_start_year = $start_year;
            $core_needs_expe_end_year = $end_year;
            $core_needs_expe_start_year_76_85 = 0;
            $core_needs_expe_end_year_76_85 = 0;
            $core_needs_expe_start_year_86_life = 0;
            $core_needs_expe_end_year_86_life = 0;
        }

        if ($local_expe_each_stage_ret_spouse == 'yes') {

            $core_needs_expe_start_year_spouse = $start_year;

            $remain_years_upto_75_spouse = 75 - (int)$data['local_info_are'];

            $core_needs_expe_end_year_spouse = $start_year + $remain_years_upto_75_spouse;


            /* 76 to 85 */

            $core_needs_expe_start_year_76_85_spouse = $core_needs_expe_end_year_spouse + 1;

            $remain_years_upto_85_spouse = 85 - (int)$data['local_info_are'];

            $core_needs_expe_end_year_76_85_spouse = $start_year + $remain_years_upto_85_spouse;



            /* 86 to life exp year */

            $core_needs_expe_start_year_86_life_spouse = $core_needs_expe_end_year_76_85_spouse + 1;

            $remain_years_upto_life_spouse = (int) $data['local_estimate_expect'] - (int)$data['local_info_are'];

            $core_needs_expe_end_year_86_life_spouse = $start_year + $remain_years_upto_life_spouse;
        } else {

            $core_needs_expe_start_year_spouse = $start_year;
            $core_needs_expe_end_year_spouse = $end_year_spouse;

            $core_needs_expe_start_year_76_85_spouse = 0;
            $core_needs_expe_end_year_76_85_spouse = 0;
            $core_needs_expe_start_year_86_life_spouse = 0;
            $core_needs_expe_end_year_86_life_spouse = 0;
        }

        /* expense startyear calculation end */

        if ($local_expe_each_stage_ret == 'yes') {

            $income_req_arr1 = [

                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85,
                    "end_year" => $core_needs_expe_end_year_76_85,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_second_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85,
                    "end_year" => $core_needs_expe_end_year_76_85,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_second_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life,
                    "end_year" => $core_needs_expe_end_year_86_life,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_third_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life,
                    "end_year" => $core_needs_expe_end_year_86_life,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_third_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]

            ];
        } else {

            $income_req_arr1 = [

                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_annual_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_care_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        }

        /* spouse expense start */

        if ($local_expe_each_stage_ret_spouse == 'yes') {

            $income_req_arr_spouse = [
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_care'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85_spouse,
                    "end_year" => $core_needs_expe_end_year_76_85_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_se_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85_spouse,
                    "end_year" => $core_needs_expe_end_year_76_85_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_se_care'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life_spouse,
                    "end_year" => $core_needs_expe_end_year_86_life_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_th_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life_spouse,
                    "end_year" => $core_needs_expe_end_year_86_life_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_th_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        } else {


            $income_req_arr_spouse = [
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_annual_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_care_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        }


        if ($data['local_est_with_spouse'] == 'yes') {

            $income_req_arr1 = array_merge($income_req_arr1, $income_req_arr_spouse);
        }


        /* spouse expense end */


        /* one off expense calculation start */

        // $one_off_exp_arr = array_combine($data['local_expense_type_main_val'],$data['local_oneoff_expense_main']);
        $one_off_exp_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_expense_type_main_val'], $data['local_oneoff_expense_main']);

        $one_off_exp_arr_struct = array();

        if (!empty($one_off_exp_arr)) {

            foreach ($one_off_exp_arr as $arr_ele) {

                foreach ($arr_ele as $one_off_exp => $one_off_year) {

                    $one_off_exp_arr_struct[] = [
                        "person" => "client",
                        "type" => "ONE_OFF_EXPENSES",
                        "start_year" => (int) $one_off_year,
                        "end_year" => (int) $one_off_year,
                        "amount" => floatval(str_replace(array("$", ","), "", $one_off_exp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }

        // one off spouse

        //$one_off_exp_arr_spouse = array_combine($data['local_expense_type_spouse_val'],$data['local_oneoff_expense_spouse']);

        $one_off_exp_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_expense_type_spouse_val'], $data['local_oneoff_expense_spouse']);


        $one_off_exp_arr_struct_spouse = array();

        if (!empty($one_off_exp_arr_spouse)) {

            foreach ($one_off_exp_arr_spouse as $arr_ele) {

                foreach ($arr_ele as $one_off_exp => $one_off_year) {

                    $one_off_exp_arr_struct_spouse[] = [
                        "person" => "spouse",
                        "type" => "ONE_OFF_EXPENSES",
                        "start_year" => (int) $one_off_year,
                        "end_year" => (int) $one_off_year,
                        "amount" => floatval(str_replace(array("$", ","), "", $one_off_exp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }

        $income_req_arr_final = array_merge($income_req_arr1, $one_off_exp_arr_struct);

        if ($data['local_est_with_spouse'] == 'yes') {

            $income_req_arr_final = array_merge($income_req_arr_final, $one_off_exp_arr_struct_spouse);
        }



        /* one off expense calculation end */


        /* charitable donation start */

        $donation_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_donate_plan_no_main'], $data['local_donate_plan_main']);


        $donation_arr_struct = array();

        if (!empty($donation_arr)) {

            foreach ($donation_arr as $donation_arr_ele) {

                foreach ($donation_arr_ele as $dona_year => $dona_amt) {

                    $don_arr_year = explode('-', $dona_year);
                    $don_arr_start_year = $don_arr_year[0];
                    $don_arr_end_year = $don_arr_year[1];

                    $donation_arr_struct[] = [

                        "person" => "client",
                        "start_year" => floatval($don_arr_start_year),
                        "end_year" => floatval($don_arr_end_year),
                        "amount" => floatval(str_replace(array("$", ","), "", $dona_amt)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }


        $donation_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_donate_plan_no_spouse'], $data['local_donate_plan_spouse']);

        $donation_arr_struct_spouse = array();

        if (!empty($donation_arr_spouse)) {

            foreach ($donation_arr_spouse as $donation_arr_spouse_ele) {

                foreach ($donation_arr_spouse_ele as $dona_year_sp => $dona_amt_sp) {

                    $don_arr_year_sp = explode('-', $dona_year_sp);
                    $don_arr_start_year_sp = $don_arr_year_sp[0];
                    $don_arr_end_year_sp = $don_arr_year_sp[1];


                    $donation_arr_struct_spouse[] = [
                        "person" => "spouse",
                        "start_year" => floatval($don_arr_start_year_sp),
                        "end_year" => floatval($don_arr_end_year_sp),
                        "amount" => floatval(str_replace(array("$", ","), "", $dona_amt_sp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }


        $donation_arr_final = $donation_arr_struct;

        if ($data['local_est_with_spouse'] == 'yes') {

            $donation_arr_final = array_merge($donation_arr_final, $donation_arr_struct_spouse);
        }

        /* charitable donation end */
        /* income array calculation start */

        $income_arr = [
            [
                "person" => "client",
                "start_year" => floatval($data['local_start_date']),
                "end_year" => floatval($data['local_end_date']),
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_your_income'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "spouse",
                "start_year" => floatval($data['local_spouse_start_date']),
                "end_year" => floatval($data['local_spouse_end_date']),
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_income'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
        ];


        $other_income_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_other_date'], $data['local_other_income']);


        if (!empty($other_income_arr)) {

            foreach ($other_income_arr as $other_income_arr_ele) {

                foreach ($other_income_arr_ele as $oth_inc_year => $oth_inc_amt) {

                    if (!empty($oth_inc_year) && !empty($oth_inc_amt)) {

                        if (str_contains($oth_inc_year, '-')) {

                            $oth_inc_year = explode('-', $oth_inc_year);
                            $other_inc_start_year = $oth_inc_year[0];
                            $other_inc_end_year = $oth_inc_year[1];
                        } else {

                            $other_inc_start_year = $oth_inc_year;
                            $other_inc_end_year = $oth_inc_year;
                        }


                        $other_income_arr_struct[] = [

                            "person" => "client",
                            "start_year" => floatval($other_inc_start_year),
                            "end_year" => floatval($other_inc_end_year),
                            "amount" => floatval(str_replace(array("$", ","), "", $oth_inc_amt)),
                            "index_rate" => floatval($data['local_inflation_rate'] / 100),
                        ];
                    }
                }
            }
        }



        if (!empty($other_income_arr_struct)) {
            $income_arr = array_merge($income_arr, $other_income_arr_struct);
        }

        //$other_income_arr_spouse = array_combine($data['local_other_spouse_date'],$data['local_other_spouse_income']);   

        $other_income_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_other_spouse_date'], $data['local_other_spouse_income']);


        $other_income_arr_struct_spouse = array();

        if (!empty($other_income_arr_spouse)) {

            foreach ($other_income_arr_spouse as $other_income_arr_spouse_ele) {

                foreach ($other_income_arr_spouse_ele as $oth_inc_year_sp => $oth_inc_amt_sp) {

                    if (!empty($oth_inc_year_sp) && !empty($oth_inc_amt_sp)) {

                        if (str_contains($oth_inc_year_sp, '-')) {

                            $oth_inc_year_sp = explode('-', $oth_inc_year_sp);
                            $other_inc_start_year_sp = $oth_inc_year_sp[0];
                            $other_inc_end_year_sp = $oth_inc_year_sp[1];
                        } else {

                            $other_inc_start_year_sp = $oth_inc_year_sp;
                            $other_inc_end_year_sp = $oth_inc_year_sp;
                        }


                        $other_income_arr_struct_spouse[] = [

                            "person" => "spouse",
                            "start_year" => floatval($other_inc_start_year_sp),
                            "end_year" => floatval($other_inc_end_year_sp),
                            "amount" => floatval(str_replace(array("$", ","), "", $oth_inc_amt_sp)),
                            "index_rate" => floatval($data['local_inflation_rate'] / 100),
                        ];
                    }
                }
            }
        }

        if (!empty($other_income_arr_struct_spouse) && $data['local_est_with_spouse'] == 'yes') {
            $income_arr = array_merge($income_arr, $other_income_arr_struct_spouse);
        }

        /* income array calculation  end */
        /* PLI array start  */

        $pli_arr = [
            [
                "person" => "client",
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_estate_value'])),
            ]

        ];

        $pli_arr_spouse = [

            [
                "person" => "spouse",
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_estate_value'])),
            ]

        ];

        if ($data['local_est_with_spouse'] == 'yes') {

            $pli_arr = array_merge($pli_arr, $pli_arr_spouse);
        }

        /* PLI array end */

        $jayParsedAry = [
            "parameters" => [
                "growth_rate" => floatval($data['local_growth_rate'] / 100),
                "income_rate" => floatval($data['local_income_rate'] / 100),
                "inflation" => floatval($data['local_inflation_rate'] / 100),
                "interest_rate" => floatval($data['local_specify_return']),
                "start_year" => $start_year,
                "client_age" => floatval($data['local_old_are']),
                "client_life_expectancy" => floatval($data['local_life_expect']),
                "spouse" => ($data['local_est_with_spouse'] == 'yes') ? true : false,
                "spouse_age" => ($data['local_est_with_spouse'] == 'yes') ? floatval($data['local_info_are']) : 0,
                "spouse_life_expectancy" => ($data['local_est_with_spouse'] == 'yes') ? floatval($data['local_estimate_expect']) : 0,
                "end_year" => $end_year,
                "end_balance" => floatval(str_replace(array("$", ","), "", $data['local_desired_estate'])),
                "sell_home" => floatval($data['local_plan_return']),
                "oas_clawback" => [
                    "base" => 72000,
                    "index" => 0.02,
                ],
                "personal_exemption" => [
                    "base" => 12896,
                    "index" => 0.02,
                ],
                "tax_rate" => [
                    "marginal" => [
                        [12070, 0],
                        [50000, 0.25],
                        [90000, 0.35],
                        [200000, 0.45],
                    ],
                    "top" => 0.54,
                ],
                "province" => "Ontario",
                "pensions" => $pension_arr,
                "incomes" => $income_arr,
                "pli" => $pli_arr,
                "income_requirements" => $income_req_arr_final,
                "charitable_donations" => $donation_arr_final,
            ],
            "start_book" => [
                "joint" => [
                    "CLEARING" => 0,
                    "HOME" => floatval(str_replace(array("$", ","), "", $data['local_Primary_value'])),
                    //"sell_home" => floatval($data['local_plan_return']),
                ],
                "client" => array_change_key_case($account_main_value_combine, CASE_UPPER),
                "spouse" => array_change_key_case($account_main_value_spouse_combine, CASE_UPPER),
                "transactions" => [],
            ],

        ];

        /* for client array */
        $check_array = self::wisely_POST_curl_api_call($jayParsedAry);
        return $check_array;
    }

  
} // End Of Class
