<div class="main-content postion-relative">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-2"></div>
            <div class="text-center p-0 mt-3 mb-2 form-step-column-wrap">
                <div class="card px-0 pt-4 pb-0 mt-3 mb-3">
                    <div id="msform" method="post">
                        <!-- progressbar-start -->
                        <div class="progress-color">
                            <ul class="progressbar">
                                <li class="progress-step">
                                    <span class="progress-common" style="width: 50%;"></span>
                                    <div class="progress-step-icon">
                                        <div class="progress-icon progress-step1">
                                            <i class="fa-thin fa-user-hair"></i>
                                        </div>

                                        <p class="progress-text">Step1</p>
                                    </div>
                                </li>
                                <li class="progress-income">
                                    <span class="progress-common"></span>
                                    <div class="progress-step-icon">
                                        <div class="progress-icon progress-step2">
                                            <i class="fa-thin fa-money-bill-wave"></i>
                                        </div>

                                        <p class="progress-text">Income</p>
                                    </div>
                                </li>
                                <li class="progress-asset">
                                    <span class="progress-common"></span>
                                    <div class="progress-step-icon">
                                        <div class="progress-icon progress-step3">
                                            <i class="fa-thin fa-vault"></i>
                                        </div>

                                        <p class="progress-text">Assets</p>
                                    </div>
                                </li>
                                <li class="progress-expense">
                                    <span class="progress-common"></span>
                                    <div class="progress-step-icon">
                                        <div class="progress-icon progress-step4">
                                            <i class="fa-thin fa-money-check-dollar-pen"></i>
                                        </div>

                                        <p class="progress-text">Expenses</p>
                                    </div>
                                </li>
                                <li class="progress-done">
                                    <span class="progress-common"></span>
                                    <div class="progress-step-icon">
                                        <div class="progress-icon progress-step5">
                                            <i class="fa-thin fa-check"></i>
                                        </div>
                                        <p class="progress-text">All Done!</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div id="first_field" class="first_field-custom">
                            <form id="first_form" method="POST">
                                <div id="first_section">
                                    <h2 class="step-main-title"> <span> <?php _e('General Information', 'listify'); ?> </span></h2>
                                    <p class="step-sub-title">To discover your Essential and Surplus Capital, let’s start with some general questions.</p>

                                    <div class="first_field-custom-wrap">
                                        <div class="wisely-form-column01">
                                            <p> Who would you like to include in the plan? </p>
                                        </div>
                                        <div class="wisely-form-column02 field-icon-wrap">
                                            <i class="fa-regular fa-person"></i>
                                            <p> You </p>
                                        </div>
                                        <div class="wisely-form-column03">
                                            <div class="field-btns-wrap">
                                                <p>With a spouse?</p>
                                                <div class="toggle-btn" id="step1-tglr">
                                                    <input type="checkbox" id="cb_value" class="cb-value" />
                                                    <input type="hidden" id="est_with_spouse" name="est_with_spouse" />
                                                    <span class="round-btn"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">How old are you? <span class="tootltip-icon" title="Enter the age you are closest to. If you’re 65 and will have a birthday in less than 5 months enter 66."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div id="hide-field">
                                                <input type="text" data-inputmask="'mask': '999'" id="old_are" name="old_are" oninput="validateRange(this)" />
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03">
                                            <div id="show-field" style="display:none;">
                                                <input type="text" data-inputmask="'mask': '999'" id="info_are" name="info_are" oninput="validateRange(this)" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What is your life expectancy estimate? <span class="tootltip-icon" title="Enter the age by which you will likely have passed away. You can be conservative with your estimate to start with and adjust it after if necessary to assess its impact on your finances. Most retirement calculators recommend age 91, but we suggest entering age 100 at first to be safe."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div id="hide-field">
                                                <input type="text" data-inputmask="'mask': '999'" id="life_expect" name="life_expect" oninput="validateRange(this)" />
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03">
                                            <div id="show-field01" style="display:none;">
                                                <input type="text" data-inputmask="'mask': '999'" id="estimate_expect" name="estimate_expect" oninput="validateRange(this)" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label>Where do you live?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div id="hide-field">
                                                <select id="live" name="live">
                                                    <option value="">Please select province</option>
                                                    <option value="Alberta">Alberta</option>
                                                    <option value="British columbia">British Columbia</option>
                                                    <option value="Manitoba">Manitoba</option>
                                                    <option value="New brunswick">New Brunswick</option>
                                                    <option value="Newfoundland & labrador">Newfoundland & Labrador</option>
                                                    <option value="Nova scotia">Nova Scotia</option>
                                                    <option value="Nunavut">Nunavut</option>
                                                    <option value="Ontario">Ontario</option>
                                                    <option value="Prince edward island">Prince Edward Island</option>
                                                    <option value="Saskatchewan">Saskatchewan</option>
                                                    <option value="Quebec">Quebec</option>
                                                    <option value="Yukon">Yukon</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03">
                                            <div id="show-field02" style="display:none;">
                                                <!--<select id="live_spouse" name="live_spouse">
                              <option value="">Please select provinces</option>
                              <option value="Alberta">Alberta</option>
                              <option value="British columbia">British Columbia</option>
                              <option value="Manitoba">Manitoba</option>
                              <option value="New brunswick">New Brunswick</option>
                              <option value="Newfoundland & labrador">Newfoundland & Labrador</option>
                              <option value="Nova scotia">Nova Scotia</option>
                              <option value="Nunavut">Nunavut</option>
                              <option value="Ontario">Ontario</option>
                              <option value="Prince edward island">Prince Edward Island</option>
                              <option value="Saskatchewan">Saskatchewan</option>
                              <option value="Quebec">Quebec</option>
                              <option value="Yukon">Yukon</option>
                            </select> -->
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row part-1-btn-wrap">
                                        <a href="javascript:void(0)" id="first_step" class="next part-1-btn" value="Part 1 - Investor Profile"><span>Part 1 - Investor Profile</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>

                                </div>
                            </form>

                            <form id="second_form" method="post">
                                <div id="second_section">
                                    <h2 class="step-main-title"> <span><?php _e('Investor Profile', 'listify'); ?> </span></h2>
                                    <p class="step-sub-title">This determines the rate at which your wealth grows throughout your life.</p>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label for="investor_main">What type of Investor are you? <span class="tootltip-icon" title="Each investor profile selection is designated a rate of return percentage to be applied to your assets and investments. Choose the appropriate option ranging from low-risk i.e., risk averse, to high-risk i.e., speculative, that best fits your investment outlook. Please note that the investor profile type you select will also be applied to your spouse if you have included them in your calculations. Investor Profile Options: Risk Averse 3%, Conservative 4%, Moderate 5%, Aggressive 6%, Speculative 7%"><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>

                                        </div>
                                        <div class="wisely-form-column02">
                                            <select id="investor_main" name="investor_main">
                                                <option value="">Please select</option>
                                                <option value="risk">Risk Averse 3%</option>
                                                <option value="conservative">Conservative 4%</option>
                                                <option value="moderate">Moderate 5%</option>
                                                <option value="aggressive">Aggressive 6%</option>
                                                <option value="speculative">Speculative 7%</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Inflation rate: <span class="tootltip-icon" title="Enter the average rate of inflation that you think will apply during the rest of your life. This is the rate of inflation that will apply to all your assets and your cost of living. The historical rate of inflation in Canada and the USA has been 2-3%."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>

                                        <div class="wisely-form-column02">
                                            <input type="text" name="inflation_rate" id="inflation_rate" data-inputmask="'mask': '9.99%'" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey wisely-income">
                                        <div class="wisely-form-column01">
                                            <label>Would you prefer to specify your own rate of return? <span class="tootltip-icon" title="Selecting yes here enables you to calculate your own rate of return by entering percentage values for income rate and growth rate. Note: Entering any values below will override any investor profile selection you selected in the first question above."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="specify-btn" id="step2-tglr">
                                                <input type="checkbox" class="specify-value" />
                                                <input type="hidden" name="wsc_own_ror" id="wsc_own_ror" />
                                                <span class="specify-round-btn"></span>
                                            </div>
                                        </div>
                                        <!-- <div class="wisely-form-column03 sp-show-field" style="display:none;">
                          <div id="sp-show-field">
                            <div class="specify_number">
                              <input type="number" name="specify_return" id="specify_return" />
                            </div> 
                          </div>
                      </div> -->
                                    </div>
                                    <div class="wisely-form-row bg-white sp-show-field" style="display:none;">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Income rate: <span class="tootltip-icon" title="This is the average rate of interest income and/or dividend income that you expect to earn on your investments. Income earned on non-registered investments is taxed in the year it is earned regardless of whether or not you receive the income or allow it to accumulate."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" name="income_rate" id="income_rate" data-inputmask="'mask': '9.99%'" />
                                        </div>
                                    </div>
                                    <div class="wisely-form-row bg-grey sp-show-field" style="display:none;" v>
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Growth rate: <span class="tootltip-icon" title="This is the capital gain appreciation you expect from investments. Total income from investments may consist of interest and dividends and capital gains. Enter only the capital gains you expect. (In Canada only 50% of Capital gains are taxable and the tax is paid when the asset is sold). We will calculate investment income based on the growth rate and the size of the investment portfolio. For example, if you assumed a growth rate of 3% and an income/dividend rate of 2%, and you had a $1,000,000 non- registered investment portfolio, we will calculate and show that your investment income for the year is $50,000."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" name="growth_rate" id="growth_rate" data-inputmask="'mask': '9.99%'" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row part-1-btn-wrap part-2-btn-wrap">
                                        <a href="javascript:void(0)" id="third_step" class="next part-1-btn"><i class="fa-solid fa-angles-left"></i><span>Part 1 - General Information</span></a>
                                        <a href="javascript:void(0)" class="next part-1-btn part-2-btns secondary-color" id="second_step"><span>Part 2 - Income</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>

                                </div>
                            </form>
                        </div>

                        <div id="second_field">
                            <form id="third_form" method="post">
                                <div id="sf_first_section">
                                    <h2 id="steps" class='step-main-title'> <span><?php _e('Income', 'listify'); ?></span></h2>
                                    <div class="first_field-custom-wrap">
                                        <div class="wisely-form-column01">
                                            <p>Employment Income <span class="tootltip-icon" title="Use this section if you will be earning any income from employment, consulting, small business, or other."><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>

                                        </div>
                                        <div class="wisely-form-column02 field-icon-wrap">
                                            <i class="fa-regular fa-person"></i>
                                            <p>You</p>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="field-btns-wrap field-icon-wrap">
                                                <i class="fa-regular fa-person"></i>
                                                <p>Spouse</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What is your annual employment income (before tax)? <span class="tootltip-icon" title="Enter the gross amount of your earned income from employment, consulting, small business, or other. Note: Do not enter the investment income you will earn or the income from a pension or an RRSP or a RRIF."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" id="your_income" class="number_custom" name="your_income" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="spouse_income" name="spouse_income" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">When will you earn this income?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="d-date-income" placeholder="Year to Year" id="your_date" name="your_date" data-inputmask="'mask': '9999-9999'">
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="d-date-income" id="spouse_date" name="spouse_date" data-inputmask="'mask': '9999-9999'" placeholder="Year to Year">
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100">
                                            <h3>Other Income <span class="tootltip-icon" title="Use this section if you expect to receive income from a rental property, lump-sum, inheritance, annuity, or other."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>

                                    <div class="new-add-more-field">
                                        <div class="wisely-form-row bg-grey">
                                            <div class="wisely-form-column01">
                                                <label class="fieldlabels">Are you expecting any other income (before tax)? <span class="tootltip-icon" title="Enter the gross amount of this other income you expect to receive from a rental property, lump-sum, inheritance, annuity or other. Note: Do not enter the investment income you will earn or the income from a pension or an RRSP or a RRIF."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>

                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="input_fields_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" id="other_income" name="other_income[]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="input_fields_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" name="other_spouse_income[]" id="other_spouse_income" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column01">
                                                <label class="fieldlabels">When will you receive this other income?</label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="date_wrap">
                                                    <div>
                                                        <input type="text" id="other_date" name="other_date[]" data-inputmask="'mask': '9999-9999'" placeholder="Year to Year">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="date_wrap">
                                                    <div>
                                                        <input type="text" class="other_spouse_date" id="other_spouse_date" name="other_spouse_date[]" data-inputmask="'mask': '9999-9999'" placeholder="Year to Year">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-buttons">
                                            <div class="wisely-form-column01">
                                                <button class="add_date_button wsf-color-blue custom-date-btn"><i class="fa-solid fa-plus"></i><span>add other income</span></button>
                                            </div>
                                            <div class="wisely-form-column02 spouse-hide-class">
                                                <button class="add_date_button wsf-color-blue custom-date-btn"><i class="fa-solid fa-plus"></i><span>add other income</span></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row part-1-btn-wrap part-2-btn-wrap"> <a href="javascript:void(0)" id="fifth_step" class="next part-1-btn"> <i class="fa-solid fa-angles-left"></i><span>Part 1 - Investor Profile</span></a>

                                        <a href="javascript:void(0)" class="next part-1-btn part-2-btns secondary-color" id="fourth_step"><span>Part 2 - Pension Income</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </form>

                            <form id="fourth_form" method="post">
                                <div id="sf_second_section">
                                    <h2 id="steps" class="step-main-title"> <span><?php _e('Pension Income', 'listify'); ?></span></h2>
                                    <div class="first_field-custom-wrap">
                                        <div class="wisely-form-column01">
                                            <p>Canada Pension Plan (CPP) or<br>Quebec Pension Plan (QPP) <span class="tootltip-icon" title="The age you start your pension, how long you contributed, and your average earnings throughout your life determine how much CPP or QPP you receive. In 2023 the maximum annual pension for someone retiring at age 65 is $15,678.84 ($1,306.57 per month)."><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>

                                        </div>
                                        <div class="wisely-form-column02 field-icon-wrap">
                                            <i class="fa-regular fa-person"></i>
                                            <p>You</p>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="field-btns-wrap field-icon-wrap">
                                                <i class="fa-regular fa-person"></i>
                                                <p>Spouse</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Have you started receiving these payments?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="payment-btn all-btn-custom pension-blue" id="step3-tglr">
                                                <input type="checkbox" class="payment-value" />
                                                <input type="hidden" name="start_rec_pay_cpp_qpp" id="start_rec_pay_cpp_qpp" value="" />
                                                <span class="payment-round-btn"></span>
                                            </div>
                                            <!-- <div id="ps-show-field" style="display:none;">
                            <input type="number" id="ps_spouse_age" name="ps_spouse_age" />
                          </div> -->
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="spouse-pay-btn all-btn-custom pension-blue" id="step12-tglr">
                                                <input type="checkbox" class="spouse-pay-value" />
                                                <input type="hidden" name="start_rec_pay_cpp_qpp_spouse" id="start_rec_pay_cpp_qpp_spouse" value="" />
                                                <span class="spouse-round-pay-btn"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white spouse-pay-show-field">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">When will you start receiving these payments? <span class="tootltip-icon" title="For each year you delay CPP or QPP up until age 70 the amount received will increase by 8.4% per year."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="pension-age-first">
                                                <input type="number" class="place-custom" id="pension_age" name="pension_age" placeholder="Age" oninput="validateRange(this)" />
                                            </div>

                                        </div>
                                        <div class="wisely-form-column03 pension-age-second spouse-hide-class">
                                            <input type="number" class="place-custom" id="pension_sn_age" name="pension_sn_age" placeholder="Age" oninput="validateRange(this)" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What is the annual amount (before tax)? <span class="tootltip-icon" title="If you don’t know what your monthly CPP payments will be, you can sign in to your My Service Canada Account for your monthly CPP estimate. For QPP, you can find more information at www.rrq.gouv.qc.ca/fr/retraite."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>

                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="pension_amount" name="pension_amount" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="pension_sn_amount" name="pension_sn_amount" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100">
                                            <h3>Old Age Security (OAS) <span class="tootltip-icon" title="The maximum pension is $8,292 for 2023. The amount you receive for OAS depends on how many years you have lived in Canada."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Have you started receiving these payments?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="security-btn all-btn-custom pension-blue" id="step4-tglr">
                                                <input type="checkbox" class="security-value" />
                                                <input type="hidden" name="start_OAS_pay" id="start_OAS_pay" />
                                                <span class="security-round-btn"></span>
                                            </div>
                                            <!--  <div id="sc-show-field" style="display:none;">
                            <input type="number" id="sc_spouse_age" name="sc_spouse_age" />
                          </div> -->
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="spouse-security-btn all-btn-custom pension-blue" id="step13-tglr">
                                                <input type="checkbox" class="spouse-security-value" />
                                                <input type="hidden" name="start_OAS_pay_spouse" id="start_OAS_pay_spouse" />
                                                <span class="spouse-security-round-btn"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white security-pay-show-field">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">When will you start receiving these payments? <span class="tootltip-icon" title="You can start receiving OAS from age 65. For each year you delay OAS up until age 70 the amount increases by 7.2%."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="security-age-first">
                                                <input type="number" class="place-custom" id="security_age" name="security_age" placeholder="Age" oninput="validateRange(this)" />
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03 security-age-second spouse-hide-class">
                                            <input type="number" class="place-custom" id="security_sn_age" name="security_sn_age" placeholder="Age" oninput="validateRange(this)" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What is the annual amount (before tax)? <span class="tootltip-icon" title="The minimum income threshold for 2023 is $86,912. If your OAS pension will be clawed back you should still enter the full gross amount. We will calculate the clawback for you and add this amount to your income tax owing. &#010;If you don’t know what your monthly OAS payments will be, you can sign in to your My Service Canada Account for your monthly OAS estimate."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="security_amount" name="security_amount" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="security_sn_amount" name="security_sn_amount" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100">
                                            <h3>Defined Benefit Pension <span class="tootltip-icon" title="Use this section if you have a private pension from a government or a private company."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Have you started receiving these payments?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="benifit-btn all-btn-custom pension-blue" id="step5-tglr">
                                                <input type="checkbox" class="benifit-value" />
                                                <input type="hidden" name="start_def_ben_pens" id="start_def_ben_pens" />
                                                <span class="benifit-round-btn"></span>
                                            </div>
                                            <!-- <div id="bp-show-field" style="display:none;">
                            <input type="number" id="bp_spouse_age" name="bp_spouse_age"/>
                          </div> -->
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="benifit-spouse-btn all-btn-custom pension-blue" id="step15-tglr">
                                                <input type="checkbox" class="spouse-benifit-value " />
                                                <input type="hidden" name="start_def_ben_pens_spouse" id="start_def_ben_pens_spouse" />
                                                <span class="spouse-benifit-round-btn"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white benifit-pay-show-field">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">When will you start receiving these payments?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="benifit-age-first">
                                                <input type="number" class="place-custom" id="benifit_age" name="benifit_age" placeholder="Age" oninput="validateRange(this)" />
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03 benifit-age-second spouse-hide-class">
                                            <input type="number" class="place-custom" id="benifit_sn_age" name="benifit_sn_age" placeholder="Age" oninput="validateRange(this)" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What is the annual amount (before tax)? <span class="tootltip-icon" title="Check your pension statement to confirm the amount. If you are not receiving your pension yet, ask your pension plan administrator for the expected amount. Enter the amount you expect to receive in the year you decide to start your pension."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="benifit_amount" name="benifit_amount" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="benifit_sn_amount" name="benifit_sn_amount" />
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Is this indexed to inflation? <span class="tootltip-icon" title="Your pension plan administrator will be able to tell you if your pension is indexed. Select yes if the pension is indexed and your estimated inflation rate will be applied. Select no if it isn’t indexed."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="index-btn all-btn-custom pension-blue" id="step6-tglr">
                                                <input type="checkbox" class="index-value" />
                                                <input type="hidden" name="indexed_to_inflatiton" value="" id="indexed_to_inflatiton" />
                                                <span class="index-round-btn"></span>
                                            </div>
                                            <div id="index-show-field" style="display:none;">
                                                <!-- <input type="number" id="index_spouse_age" name="index_spouse_age" /> -->
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="spouse-index-btn all-btn-custom pension-blue" id="step17-tglr">
                                                <input type="checkbox" class="spouse-index-value " />
                                                <input type="hidden" name="indexed_to_inflatiton_spouse" value="" id="indexed_to_inflatiton_spouse" />
                                                <span class="spouse-index-round-btn"></span>
                                            </div>
                                            <div id="spouse-index-show-field" style="display:none;">

                                            </div>
                                        </div>
                                    </div>
                                    <div class="wisely-form-row part-1-btn-wrap part-2-btn-wrap">
                                        <a href="javascript:void(0)" id="seven_step" class="next part-1-btn secondary-color"><i class="fa-solid fa-angles-left"></i><span>Part 2 - Income</span></a>

                                        <a href="javascript:void(0)" class="next part-1-btn part-2-btns third-color" id="six_step"><span>Part 3 - Assets</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div id="third_field">
                            <form id="fifth_form" method="post">
                                <div id="td_first_section">
                                    <h2 class="steps step-main-title"><span><?php _e('Assets'); ?></span></h2>
                                    <div class="first_field-custom-wrap">
                                        <div class="wisely-form-column01">
                                            <p>Registered Investments<span class="tootltip-icon" title="Tax-Free Savings Account(TFSA): When money is withdrawn from your TSFA it is not taxable. &#010; Registered Retirement Savings Plan (RRSP): When money is withdrawn from your RRSP account it is taxable. At age 71 your RRSP account, if you have one, will automatically convert into a RRIF account. &#010; Registered Retirement Income Fund (RRIF): At age 71 RRSPs must be converted to a RRIF. We will calculate the withdrawal amount for your income each year. &#010; Locked-in Retirement Account (LIRA): If you have contributed to a Defined Contribution Pension Plan you may have a LIRA. At age 71 we will automatically convert your LIRA account into a LIF account. &#010; Life Income Fund (LIF): Use this if you have a LIRA account that has been converted to a LIF (Life Income Fund). We will calculate the withdrawal amount for your income each year. &#010;"><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>
                                        </div>
                                        <div class="wisely-form-column02 field-icon-wrap">
                                            <i class="fa-regular fa-person"></i>
                                            <p>You</p>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="field-btns-wrap field-icon-wrap">
                                                <i class="fa-regular fa-person"></i>
                                                <p>Spouse</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="select-account-field">
                                        <div class="wisely-form-row bg-grey">
                                            <div class="wisely-form-column01">
                                                <label>Please select any account(s) you have?</label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="account_wrap">
                                                    <div>
                                                        <select class="account_main" id="account_main" name="account_main[]">
                                                            <option value="">Please select</option>
                                                            <option value="TFSA" title="When money is withdrawn from your TSFA it is not taxable."><i class="fa-sharp fa-solid fa-circle-info">TFSA</option>
                                                            <option value="RRSP" title="When money is withdrawn from your RRSP account it is taxable. At age 71 your RRSP account, if you have one, will automatically convert into a RRIF account.">RRSP</option>
                                                            <option value="RRIF" title="At age 71 RRSPs must be converted to a RRIF. We will calculate the withdrawal amount for your income each year.">RRIF</option>
                                                            <option value="LIRA" title="If you have contributed to a Defined Contribution Pension Plan you may have a LIRA. At age 71 we will automatically convert your LIRA account into a LIF account.">LIRA</option>
                                                            <option value="LIF" title="Use this if you have a LIRA account that has been converted to a LIF (Life Income Fund). We will calculate the withdrawal amount for your income each year.">LIF</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="account_wrap">
                                                    <div>
                                                        <select class="spouse_main" id="spouse_main" name="spouse_main">
                                                            <option value="">Please select</option>
                                                            <option value="TFSA" title="When money is withdrawn from your TSFA it is not taxable."><i class="fa-sharp fa-solid fa-circle-info">TFSA</option>
                                                            <option value="RRSP" title="When money is withdrawn from your RRSP account it is taxable. At age 71 your RRSP account, if you have one, will automatically convert into a RRIF account.">RRSP</option>
                                                            <option value="RRIF" title="At age 71 RRSPs must be converted to a RRIF. We will calculate the withdrawal amount for your income each year.">RRIF</option>
                                                            <option value="LIRA" title="If you have contributed to a Defined Contribution Pension Plan you may have a LIRA. At age 71 we will automatically convert your LIRA account into a LIF account.">LIRA</option>
                                                            <option value="LIF" title="Use this if you have a LIRA account that has been converted to a LIF (Life Income Fund). We will calculate the withdrawal amount for your income each year.">LIF</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column01">
                                                <label>What is the current value in this account?</label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="spouse_account_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" id="account_value" name="account_value[]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="spouse_account_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" id="spouse_value" name="spouse_value[]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-buttons">
                                            <div class="wisely-form-column01">
                                                <button class="add_spouse_button wsf-color-green custom-date-btn"><i class="fa-solid fa-plus"></i><span>add account</span></button>
                                            </div>
                                            <div class="wisely-form-column02 spouse-hide-class">
                                                <button class="add_spouse_button wsf-color-green custom-date-btn"><i class="fa-solid fa-plus"></i><span>add account</span></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100 green-line">
                                            <h3>Non-Registered Investments <span class="tootltip-icon" title="This represents all assets and investments excluding your primary residence (on which there is no tax on the capital gain) and registered assets such as RRSPs, RRIFs, TSFAs etc. Use this section if you have a cottage, a rental property, non-registered investment account(s), non-registered bank account(s), the value of a holding company, an art collection or any other valuable asset."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>
                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What is the current value? <span class="tootltip-icon" title="Enter the total current market value of all or your non-registered investments."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="ct_account_value" name="ct_account_value" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="st_account_value" name="st_account_value" />
                                        </div>
                                    </div>
                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Estimate the initial cost (book value)? <span class="tootltip-icon" title="Enter the total cost or book value of all of your non-registered investments listed above. The difference between the total value of your non-registered investments and the total cost of your non-registered investments represents a capital gain. 50 % of the capital gain will be taxable when the asset is sold."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="ct_book_value" name="ct_book_value" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="st_book_value" name="st_book_value" />
                                        </div>
                                    </div>
                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100 green-line">
                                            <h3>Life Insurance <span class="tootltip-icon" title="Use this section if you have universal or whole life insurance and indicate the face value of the policy that your spouse or immediate family will receive at death. This amount will form part of your surplus capital. If you have universal or whole life insurance and someone outside of your immediate family is the beneficiary, please don’t enter any life insurance value here for this section because we don’t want to include the value and inflate your total net estate projection."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">What will be the death benefit left to your estate?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="estate_value" name="estate_value" />
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" id="se_estate_value" name="se_estate_value" />
                                        </div>
                                    </div>
                                    <!--                   <div class="wisely-form-row bg-white">
                      <div class="wisely-form-column01">
                        <label class="fieldlabels">Who will be the beneficiary?</label>
                      </div>
                      <div class="wisely-form-column02">
                          <select id="asset_by_main" name="asset_by_main">
                            <option value="">Please select</option>
                            <option value="spouse">Spouse</option>
                            <option value="other">Other</option>
                          </select>
                      </div>
                      <div class="wisely-form-column03 spouse-hide-class">
                          <select id="se_asset_by_main" name="se_asset_by_main">
                            <option value="">Please select</option>
                            <option value="spouse_you">Spouse (You)</option>
                            <option value="other">Other</option>
                          </select>
                      </div>
                  </div> -->

                                    <div class="wisely-form-row part-1-btn-wrap part-2-btn-wrap">
                                        <a href="javascript:void(0)" id="nine_step" class="next part-1-btn secondary-color"> <i class="fa-solid fa-angles-left"></i><span>Part 2 - Pension Income</span></a>

                                        <a href="javascript:void(0)" class="next part-1-btn part-2-btns third-color" id="eight_step"><span>Part 3 - Primary Residence</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </form>

                            <form id="six_form" method="post">
                                <div id="td_second_section">
                                    <h2 class="steps step-main-title"><span><?php _e('Assets'); ?></span></h2>
                                    <p class="step-sub-title"><?php _e('Primary Residence'); ?> <span class="tootltip-icon" title="We will assume your home increases at your chosen inflation rate and when the home is eventually sold the gain is considered to be a tax-free capital gain."><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>
                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label>What is the current market value of your home?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" id="primary_value" name="primary_value" />
                                        </div>

                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label>Do you plan to sell your home in the future?</label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="plan-btn all-btn-custom asset-green" id="step7-tglr">
                                                <input type="checkbox" class="plan-value" />
                                                <span class="plan-round-btn"></span>
                                                <input type="hidden" id="wsc_sell_home_future" name="wsc_sell_home_future" />
                                            </div>
                                        </div>

                                    </div>

                                    <div id="plan-show-field" style="display:none;">
                                        <div class="wisely-form-row bg-grey">
                                            <div class="wisely-form-column01">
                                                <label class="fieldlabels">When would you like to sell?</label>
                                            </div>

                                            <div class="wisely-form-column02">
                                                <input type="text" id="plan_return" name="plan_return" placeholder="Year" data-inputmask="'mask': '9999'" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white part-1-btn-wrap part-2-btn-wrap">
                                        <a href="javascript:void(0)" id="eleven_step" class="next part-1-btn"><i class="fa-solid fa-angles-left"></i><span>Part 2 - Assets</span></a>

                                        <a href="javascript:void(0)" class="next part-1-btn part-2-btns third-color" id="ten_step"><span>Part 3 - Expenses</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div id="four_field">
                            <form id="seven_form" method="post">
                                <div id="fr_first_section">
                                    <h2 class="steps step-main-title"><span><?php _e('Expenses'); ?></span></h2>

                                    <div class="first_field-custom-wrap">
                                        <div class="wisely-form-column01">
                                            <p>Retirement Expenses <span class="tootltip-icon" title="Enter the expected annual cost of essential items for the lifestyle you desire throughout your retirement years. Note: If you’re a Surplus member you have access to a comprehensive expenses worksheet to help give you a more accurate estimate of all of your expenses e.g., discretionary, non-discretionary, health care, one-off items."><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>
                                        </div>
                                        <div class="wisely-form-column02 field-icon-wrap">
                                            <i class="fa-regular fa-person"></i>
                                            <p>You</p>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="field-btns-wrap field-icon-wrap">
                                                <i class="fa-regular fa-person"></i>
                                                <p>Spouse</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label>Annual expenses: <span class="tootltip-icon" title="Enter a rounded estimate of the annual cost for the lifestyle you desire throughout your retirement years."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <input type="text" class="number_custom" name="annual_expense" id="annual_expense">
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <input type="text" class="number_custom" name="se_annual_expense" id="se_annual_expense">
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Annual health care expenses: <span class="tootltip-icon" title="Enter a rounded estimate of the annual cost of health care throughout your retirement years."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div id="">
                                                <input type="text" class="number_custom" name="care_expense" id="care_expense">
                                            </div>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div id="">
                                                <input type="text" class="number_custom" name="se_care_expense" id="se_care_expense">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label class="fieldlabels">Would you prefer to specify your expense amounts through each stage of retirement instead? <span class="tootltip-icon" title="Your spending priorities will likely change with each decade in retirement. Selecting yes will help you break down your expenses and health care for each decade giving you a more accurate estimate."><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="prefer-btn all-btn-custom expense-orange" id="step8-tglr">
                                                <input type="checkbox" id="prefer-value" class="prefer-value" />
                                                <input type="hidden" id="expe_each_stage_ret" name="expe_each_stage_ret" />
                                                <span class="prefer-round-btn"></span>
                                            </div>
                                            <!-- <div id="prefer-show-field" style="display:none;">
                              <input type="text" class="number_custom" id="prefer_value" name="prefer_value" />
                            </div> -->
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="spouse-prefer-btn all-btn-custom expense-orange" id="step16-tglr">
                                                <input type="checkbox" id="spouse-prefer-value" class="spouse-prefer-value" />
                                                <input type="hidden" id="expe_each_stage_ret_spouse" name="expe_each_stage_ret_spouse" />
                                                <span class="spouse-prefer-round-btn"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="expense-amounts-hide" style="display:none;">
                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column100 orange-line">
                                                <h3>Retirement Stage 1: Current Age to 75 <span class="tootltip-icon" title="People usually spend 15%-25% less on discretionary and non-discretionary expenses approaching the age of 75. &#010;Experts estimate between $40,000 to $70,000 to cover the annual spending needs for most single retired Canadians. For a retired couple, the range might be between $50,000 to $80,000. &#010;As a precaution, you could increase your health spending estimates by 15%-25% nearing the age of 75."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                            </div>
                                        </div>

                                        <div class="retirement-stage-1">
                                            <div class="wisely-form-row bg-grey">
                                                <div class="wisely-form-column01">
                                                    <label class="fieldlabels">Annual expenses from your current age to 75:</label>
                                                </div>
                                                <div class="wisely-form-column02">
                                                    <div class="retirement-first" style="display:none;">
                                                        <input type="text" class="number_custom" name="annual_age" id="annual_age">
                                                    </div>
                                                </div>
                                                <div class="wisely-form-column03 spouse-hide-class">
                                                    <div class="retirement-second" style="display:none;">
                                                        <input type="text" class="number_custom" name="spouse_annual_age" id="spouse_annual_age">
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="wisely-form-row bg-white">
                                                <div class="wisely-form-column01">
                                                    <label class="fieldlabels">Annual health care expenses from your current age to 75:</label>
                                                </div>
                                                <div class="wisely-form-column02">
                                                    <div class="retirement-first" style="display:none;">
                                                        <input type="text" class="number_custom" name="care_age" id="care_age">
                                                    </div>
                                                </div>
                                                <div class="wisely-form-column03 spouse-hide-class">
                                                    <div class="retirement-second" style="display:none;">
                                                        <input type="text" class="number_custom" name="spouse_care_age" id="spouse_care_age">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column100 orange-line">
                                                <h3>Retirement Stage 2: Ages 76 to 85 <span class="tootltip-icon" title="Expect to reduce spending by a further 15%-25% on discretionary and non-discretionary expenses by the age of 85. You may spend less on travel, clothes, drinking, dining, etc. &#010;Depending on your situation, health care expenses may increase by a further 15%-25% nearing the age of 85."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                            </div>
                                        </div>
                                        <div class="retirement-stage-2">
                                            <div class="wisely-form-row bg-grey">
                                                <div class="wisely-form-column01">
                                                    <label class="fieldlabels">Annual expenses from age 76 to 85:</label>
                                                </div>
                                                <div class="wisely-form-column02">
                                                    <div class="retirement-first" style="display:none;">
                                                        <input type="text" class="number_custom" name="second_annual_age" id="second_annual_age">
                                                    </div>
                                                </div>
                                                <div class="wisely-form-column03 spouse-hide-class">
                                                    <div class="retirement-second" style="display:none;">
                                                        <input type="text" class="number_custom" name="spouse_se_annual_age" id="spouse_se_annual_age">
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="wisely-form-row bg-white">
                                                <div class="wisely-form-column01">
                                                    <label class="fieldlabels">Annual health care expenses from ages 76 to 85:</label>
                                                </div>
                                                <div class="wisely-form-column02">
                                                    <div class="retirement-first" style="display:none;">
                                                        <input type="text" class="number_custom" name="second_care_age" id="second_care_age">
                                                    </div>
                                                </div>
                                                <div class="wisely-form-column03 spouse-hide-class">
                                                    <div class="retirement-second" style="display:none;">
                                                        <input type="text" class="number_custom" name="spouse_se_care_age" id="spouse_se_care_age">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column100 orange-line">
                                                <h3>Retirement Stage 3: Ages 86 to Life Expectancy <span class="tootltip-icon" title="Keep in mind that maintaining your health will likely take full priority during this period, so expect to allocate just a small amount towards non-discretionary expenses while most of it will go towards health care. &#010;Experts estimate annual health costs ranging from $60,000 to $100,000 for single Canadians."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                            </div>
                                        </div>
                                        <div class="retirement-stage-3">

                                            <div class="wisely-form-row bg-grey">
                                                <div class="wisely-form-column01">
                                                    <label class="fieldlabels">Annual expenses from age 86 to life expectancy:</label>
                                                </div>
                                                <div class="wisely-form-column02">
                                                    <div class="retirement-first" style="display:none;">
                                                        <input type="text" class="number_custom" name="third_annual_age" id="third_annual_age">
                                                    </div>
                                                </div>
                                                <div class="wisely-form-column03 spouse-hide-class">
                                                    <div class="retirement-second" style="display:none;">
                                                        <input type="text" class="number_custom" name="spouse_th_annual_age" id="spouse_th_annual_age">
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="wisely-form-row bg-white">
                                                <div class="wisely-form-column01">
                                                    <label class="fieldlabels">Annual health care expenses from age 86 to life expectancy:</label>
                                                </div>
                                                <div class="wisely-form-column02">
                                                    <div class="retirement-first" style="display:none;">
                                                        <input type="text" class="number_custom" name="third_care_age" id="third_care_age">
                                                    </div>
                                                </div>
                                                <div class="wisely-form-column03 spouse-hide-class">
                                                    <div class="retirement-second" style="display:none;">
                                                        <input type="text" class="number_custom" name="spouse_th_care_age" id="spouse_th_care_age">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row part-1-btn-wrap part-2-btn-wrap">
                                        <a href="javascript:void(0)" id="thirteen_step" class="next part-1-btn third-color"><i class="fa-solid fa-angles-left"></i><span>Part 2 - Assets</span></a>

                                        <a href="javascript:void(0)" class="next part-1-btn part-2-btns fifth-color" id="twelve_step"><span>Part 3 - One-Off Expenses</span><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div id="five_field">
                            <form id="nine_form" method="post">
                                <div id="five_first_section">
                                    <h2 class="steps step-main-title"><span><?php _e('Expenses'); ?></span></h2>
                                    <div class="first_field-custom-wrap">
                                        <div class="wisely-form-column01">
                                            <p>One‐off Expenses <span class="tootltip-icon" title="Enter any one-off items you anticipate in the future. One-off expenses could include travel and vacations, any big-ticket items, gifting, and helping children with downpayments or weddings. Note: If you’re a Surplus member, you can access the comprehensive expenses worksheet to help you."><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>
                                        </div>
                                        <div class="wisely-form-column02 field-icon-wrap">
                                            <i class="fa-regular fa-person"></i>
                                            <p>You</p>
                                        </div>
                                        <div class="wisely-form-column03 spouse-hide-class">
                                            <div class="field-btns-wrap field-icon-wrap">
                                                <i class="fa-regular fa-person"></i>
                                                <p>Spouse</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="one‐off-expenses">
                                        <div class="wisely-form-row bg-grey">
                                            <div class="wisely-form-column01">
                                                <label> <?php _e('One-off expense amount:'); ?></label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="expense_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" name="expense_type_main_val[]" id="expense_type_main_val">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="expense_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" name="expense_type_spouse_val[]" id="expense_type_spouse_val">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column01">
                                                <label class="fieldlabels"> <?php _e('When will this one-off expense occur?'); ?> </label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="expense_spouse_wrap">
                                                    <div>
                                                        <input type="text" class="d-date-income oneoff_expense_main" name="oneoff_expense_main[]" id="oneoff_expense_main" data-inputmask="'mask': '9999'" placeholder="Year">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="expense_spouse_wrap">
                                                    <div>
                                                        <input type="text" class="d-date-income oneoff_expense_spouse" name="oneoff_expense_spouse[]" id="oneoff_expense_spouse" data-inputmask="'mask': '9999'" placeholder="Year">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-buttons">
                                            <div class="wisely-form-column01">
                                                <button class="add_expense_spouse_button wsf-color-orange custom-date-btn"><i class="fa-solid fa-plus"></i><span>add one-off item</span></button>
                                            </div>
                                            <div class="wisely-form-column02 spouse-hide-class">
                                                <button class="add_expense_spouse_button wsf-color-orange custom-date-btn"><i class="fa-solid fa-plus"></i><span>add one-off item</span></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100 orange-line">
                                            <h3>Charitable Donations <span class="tootltip-icon" title="Use this section if you will make a one-time donation or any annual donations in the future. We will record this as a use of funds and will calculate the income tax reduction from any donations you make."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>

                                    <div class="charitable-section">
                                        <div class="wisely-form-row bg-grey">
                                            <div class="wisely-form-column01">
                                                <label>Annual donations:</label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="donate_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" name="donate_plan_main[]" id="donate_plan_main">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="donate_wrap">
                                                    <div>
                                                        <input type="text" class="number_custom" name="donate_plan_spouse[]" id="donate_plan_spouse">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="wisely-form-row bg-white">
                                            <div class="wisely-form-column01">
                                                <label class="fieldlabels"> When will these donations occur? </label>
                                            </div>
                                            <div class="wisely-form-column02">
                                                <div class="donate_spouse_wrap">
                                                    <div>
                                                        <input type="text" class="d-date-income donate_plan_no_main" name="donate_plan_no_main[]" id="donate_plan_no_main" data-inputmask="'mask': '9999-9999'" placeholder="Year to Year">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wisely-form-column03 spouse-hide-class">
                                                <div class="donate_spouse_wrap">
                                                    <div>
                                                        <input type="text" class="d-date-income donate_plan_no_spouse" name="donate_plan_no_spouse[]" id="donate_plan_no_spouse" data-inputmask="'mask': '9999-9999'" placeholder="Year to Year">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-buttons">
                                            <div class="wisely-form-column01">
                                                <button class="add_donate_spouse_button wsf-color-orange custom-date-btn "><i class="fa-solid fa-plus"></i><span>add donation</span></button>
                                            </div>
                                            <div class="wisely-form-column02 spouse-hide-class">
                                                <button class="add_donate_spouse_button wsf-color-orange custom-date-btn"><i class="fa-solid fa-plus"></i><span>add donation</span></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-white">
                                        <div class="wisely-form-column100 orange-line">
                                            <h3>Desired Estate (to be left to heirs) <span class="tootltip-icon" title="Please state your desired estate amount (if any) you’d like to leave behind to your family, heirs, and charities at your life expectancy age. Stating this amount will help determine whether you have a surplus by excluding the amount from the projections in your retirement years. The amount is then added back into your net estate at life expectancy. Note: Keep in mind that if you have included a life insurance policy as part of your calculations, the death benefit of the policy will also be added to your total net estate at life expectancy. &#010;If you have included a spouse as part of your calculations, please use the desired estate amount as a combined total for both of you."><i class="fa-sharp fa-solid fa-circle-info"></i></span></h3>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row bg-grey">
                                        <div class="wisely-form-column01">
                                            <label> <?php _e("How much (in dollars with today’s purchasing power) would you like to leave behind to your family, heirs and charities?"); ?> <span class="tootltip-icon" title="There are 3 possible answers to consider: &#010;&#010;1. The minimum - You know your heirs the best, so you should decide on the minimum amount you consider to be an appropriate inheritance. If you are conservative in your assumptions, i.e., planning to live to age 100, planning for higher than expected living expenses, and lower than expected revenues, then the estate will probably be higher than the minimum amount considered to be appropriate. But by entering the minimum acceptable amount it is possible to determine if you have a surplus – even if you spend more than expected and live to age 100. &#010;&#010;2. Whatever is left over - If you are not concerned about leaving an estate then you should enter a nominal amount to cover funeral and estate costs. By entering this amount you will be able to determine if you currently have a surplus that could be used for a better lifestyle, to help heirs now, or to support some cause that is important to you. &#010;&#010;3. Leaving as much as possible it will not be possible to calculate a ‘surplus’ because all of your capital is necessary to achieve the ‘as much as possible’ goal. We suggest spending less and purchasing whole life insurance to achieve the ‘as much as possible’ goal. The calculator will still be useful in that it will show you how large the estate is likely to be based on current spending and how much larger it could be if you reduce spending. &#010;&#010;Note: If you’re a Surplus member, you can access the desired estate worksheet to help you calculate this. "><i class="fa-sharp fa-solid fa-circle-info"></i></span></label>
                                        </div>
                                        <div class="wisely-form-column02">
                                            <div class="expense_wrap">
                                                <div>
                                                    <input type="text" class="number_custom" name="desired_estate_main" id="desired_estate_main">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="wisely-form-row part-1-btn-wrap part-2-btn-wrap">
                                        <a href="javascript:void(0)" id="fifteen_step" class="next part-1-btn"><i class="fa-solid fa-angles-left"></i><span>Part 3 - Expenses</span></a>

                                        <input type="hidden" name="wsc_calculate_data" id="wsc_calculate_data" value="yes">
                                        <a href="javascript:void(0)" class="data-save next part-1-btn part-2-btns six-color" id="fourteen_step"><span>CALCULATE MY RETIREMENT!</span>
                                            <span class="spinner hidden" id="spinner"></span></a>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div id="seven_field">
                            <form id="eleven_form" method="post">
                                <div id="deven_first_section" class="heading-steps-wrap">
                                    <h2 id=""> <?php _e('Your Current Financial Summary'); ?> </h2>
                                    <p>The breakdowns below summarize all of the information you have provided so far. Regularly update and optimize these totals to see how they impact your Essential Capital and Surplus Capital projections.</p>
                                </div>
                                <div class="main-result">
                                    <div class="financial-summery-wrap">
                                        <div class="first-result-show step-result01">
                                            <div class="result-card">
                                                <div class="result-title">
                                                    <div class="result-icon">
                                                        <i class="fa-thin fa-user-hair"></i>
                                                    </div>
                                                    <h4 id="heading"> <?php _e('Summary Of My Information'); ?> </h4>
                                                </div>

                                                <div class="summary-first-result">
                                                    <div id="old_age_display"></div>
                                                    <div id="life_expect_display"></div>
                                                    <div id="live_display"></div>
                                                </div>
                                                <div class="summary-last-result">
                                                    <div id="info_age_display"></div>
                                                    <div id="estimate_age_display"></div>
                                                    <div id="spouse_live_display"></div>
                                                </div>
                                                <div class="result-btn">
                                                    <a href="javascript:void(0)" class="summary-btn" id="re-first-btn">Edit My Information</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="second-result-show step-result02">
                                            <div class="result-card">
                                                <div class="result-title">
                                                    <div class="result-icon">
                                                        <i class="fa-thin fa-money-bill-wave"></i>
                                                    </div>
                                                    <h4 id="heading"> <?php _e('Income Breakdown'); ?> </h4>
                                                </div>
                                                <div class="summary-result">
                                                    <div class="edit-sn-btn">
                                                        <div id="income_display"></div>
                                                        <a href="javascript:void(0)" id="re-second-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="other_display"></div>
                                                        <a href="javascript:void(0)" id="edit-second-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="pension_display"></div>
                                                        <a href="javascript:void(0)" id="editPension-second-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="security_display"></div>
                                                        <a href="javascript:void(0)" id="editage-second-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="benifit_display"></div>
                                                        <a href="javascript:void(0)" id="editBenefit-second-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                </div>

                                                <div class="result-btn">
                                                    <a href="javascript:void(0)" class="summary-btn" id="re-second-btn">Edit My Information</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="third-result-show step-result03">
                                            <div class="result-card">
                                                <div class="result-title">
                                                    <div class="result-icon">
                                                        <i class="fa-thin fa-vault"></i>
                                                    </div>
                                                    <h4 id="heading"> <?php _e('Assets Breakdown'); ?> </h4>
                                                </div>
                                                <div class="summary-result">
                                                    <div class="edit-sn-btn">
                                                        <div id="account_display"></div>
                                                        <a href="javascript:void(0)" id="re-third-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="ct_account_display"></div>
                                                        <a href="javascript:void(0)" id="edit-non-reg-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="estate_display"></div>
                                                        <a href="javascript:void(0)" id="edit-life-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="primary_display"></div>
                                                        <a href="javascript:void(0)" id="edit-primary-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                </div>
                                                <div class="result-btn">
                                                    <a href="javascript:void(0)" class="summary-btn" id="re-third-btn">Edit My Information</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fourth-result-show step-result04">
                                            <div class="result-card">
                                                <div class="result-title">
                                                    <div class="result-icon"><i class="fa-thin fa-money-check-dollar-pen"></i></div>
                                                    <h4 id="heading"> <?php _e('Expense Breakdown'); ?> </h4>
                                                </div>
                                                <div class="summary-result">
                                                    <div class="edit-sn-btn">
                                                        <div id="annual_display"></div>
                                                        <a href="javascript:void(0)" id="re-fourth-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="care_display"></div>
                                                        <a href="javascript:void(0)" id="edit-care-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="oneoff_display"></div>
                                                        <a href="javascript:void(0)" id="edit-oneoff-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="donate_display"></div>
                                                        <a href="javascript:void(0)" id="edit-donate-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                    <div class="edit-sn-btn">
                                                        <div id="desired_display"></div>
                                                        <a href="javascript:void(0)" class="edit-sn-btn" id="edit-desired-btn"><i class="fa-light fa-pen-to-square"></i></a>
                                                    </div>
                                                </div>
                                                <div class="result-btn">
                                                    <a href="javascript:void(0)" class="summary-btn" id="re-fourth-btn">Edit My Information</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </form>

                            <div class="your-result">
                                <h3>Your Results</h3>
                                <p>The projections above aim to clarify your future and maximize your spending opportunities.
                                    <br>Please note the following definitions to add further context to your results:
                                </p>
                                <div class="your-result-inner">
                                    <p><b>Essential Capital:</b></p>&nbsp;<p>This enables you to maintain your standard of living throughout your retirement.</p>
                                </div>
                                <div class="your-result-inner">
                                    <p><b>Surplus Capital:</b></p>&nbsp;<p>After your essentials are covered, this is the excess money that can set your retirement free. Now that you know, think of all of the endless possibilities on how to enjoy life with it.</p>
                                </div>
                                <!-- <div class="your-result-inner" >
                    <p><b>Shortfall:</b></p>&nbsp;<p>You don't have enough money to support your current standard of living. While not ideal, it's better to know now. If you selected a conservative life expectancy estimate of 100, try reducing this number and calculate your results again. If you are still projected for a shortfall, please seek professional guidance.</p>
                  </div> -->
                                <p>Make sure you update your information regularly to keep your plan up to date.</p>

                            </div>

                            <div class="wisely-table-wrap">
                                <h3>Essential Capital and Surplus Capital Results</h3>
                                <!--   <div class="chart-wrapper"><canvas id="chart"></canvas></div> -->
                                <div class="chartWrapper">
                                    <div class="chartAreaWrapper">
                                        <div class="chartAreaWrapper2">
                                            <canvas id="chart" height="500" width="1200"></canvas>
                                        </div>
                                    </div>
                                    <canvas id="axis-Test" height="500" width="0"></canvas>
                                </div>
                                <div class="site-three-btn-wrap">
                                    <ul>
                                        <li class="essential-btn">Essential</li>
                                        <li class="surplus-btn">Surplus</li>
                                        <!-- <li class="shortfall-btn">Shortfall</li> -->
                                    </ul>
                                </div>
                                <?php $user_id = (isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : get_current_user_id());
                                $active_subscrition = false;
                                if (is_user_logged_in()) {
                                    $user_id = get_current_user_id();
                                    $subscriptions = wcs_get_users_subscriptions($user_id);
                                    if (!empty($subscriptions)) {
                                        foreach ($subscriptions as $subscription) {
                                            if ($subscription->get_status() == 'active') {
                                                $active_subscrition = true;
                                            }
                                        }
                                    }

                                    if ($active_subscrition) {
                                ?>
                                        <div class="step-buttons">

                                            <a href="javascript:void(0)" id="pdf-button" class="pdf-buttons"><i class="fa-light fa-file-pdf"></i></a>

                                            <a href="javascript:void(0)" id="csv-import" class="pdf-buttons csv-buttons"><i class="fa-light fa-file-arrow-down"></i></a>

                                            <span id="report-save-upload" class="pdf-buttons save-btn"><i class="fa-light fa-floppy-disk"></i></span>
                                        </div>
                                <?php
                                    }
                                } ?>

                                <?php /* ?>
                  <div class="general-info main-table">
                      <h5>General Information</h5>
                      <div class="general-table comparison" style="overflow-x: scroll;">
                    </div>
                  </div>
                  <?php */ ?>
                                <div class="main-table">
                                    <h5>Your Financial Plan</h5>
                                    <div class="income-table comparison" style="overflow: scroll;height: calc(100vh - 180px);">
                                    </div>
                                </div>

                            </div>



                            <div class="assumption-result">
                                <a href="#" id="assumption-div">Assumptions <i class="fa-solid fa-angle-down"></i></a>
                                <div id="assumption-content" style="display: none;">
                                    <p>We assume you're already retired or nearing retirement.</p>
                                    <p>Your chosen rate of return will be applied to your investments throughout your retirement.</p>
                                    <p>Your chosen inflation rate will be applied to CPP, OAS, private pensions (if indexed), your home and other real estate, expenses, health care, and donations.</p>
                                    <p>All projected incomes are gross income. The tax rate is set to the average tax rate based on your annual income entered in the calculator (using 2022 federal and provincial tax rates).</p>
                                    <p>In the projections, each yearly column represents a 12-month period so, for example, if you create your financial plan on March 10th 2023, the first year/column labeled 2023 is actually for the period March 10th 2023 to March 9th 2024.</p>
                                    <p>Any withdrawals from your investments deemed necessary to support your lifestyle will occur at the beginning of each year. </p>
                                    <p>Maximum RRSP and TFSA contributions, limits, or any tax-relative rebates are not considered as part of these calculations.</p>
                                    <p>RRIF and LIF maximum and minimum withdrawal limits are considered.</p>
                                    <p>CPP, OAS and private pension amounts should be entered at nominal values because the program will make the appropriate adjustment if the amounts will be adjusted for inflation.</p>
                                    <p>OAS claw-back rules are considered in your calculations.</p>
                                    <p>CPP deferral benefit and withdrawal penalty are considered in your calculations.</p>
                                    <p>The calculator does not automatically apply pension income splitting for couples, but if you wish to see the impact of splitting pension income for tax purposes when you enter the pension amounts enter 50% for each spouse. </p>
                                    <p>Life Insurance - the face value or death benefit will be left to your selected beneficiary or net estate at the end of your estimated life expectancy.</p>
                                    <p>Annual retirement expenses, health care, one-off expenses, donations, and desired estate are all combined totals when including a spouse in your plan.</p>
                                    <p>The "desired estate" value is in today's dollars and will be excluded from your Essential Capital and Surplus Capital projections throughout your retirement for you to be able to accurately assess your retirement finances. We will reintroduce your desired estate value in today's dollars to your net estate at the end of your estimated life expectancy. </p>
                                    <p>Your retirement is supported by the liquidation of assets in the following order: non-registered, TFSA, RRIF/RRSP, LIF/LIRA.</p>
                                    <p>Projected essential, surplus, and shortfall amounts are all expressed in nominal or future dollars, incorporating the combined impacts of growth and inflation.</p>
                                    <p>Your total net worth value at the end of your estimated life expectancy does not consider the impact of tax or any other charges that may be incurred upon estate settlement.</p>
                                    <p>The projected results are not guaranteed. They are for a primary analysis to be used in conjunction with professional advice.</p>
                                </div>
                            </div>

                            <div class="disclaimer-result">
                                <h3>Disclaimer</h3>


                                <p>The Essential and Surplus Capital calculator is for illustrative purposes only.</p>
                                <p>Like all financial planning tools, it should be understood that there are certain limitations with our calculator.</p>
                                <p>Any results or contents herein can be used as an aid to an existing retirement plan, but they are rough estimates based on the information that you provided. </p>
                                <p>Any results generated by the calculator should not be considered a replacement for a comprehensive retirement plan, investment, or financial advice. </p>
                                <p>Any results can be used as an estimate for your financial future, but due to the economic unpredictability of the future, the results should not be interpreted as a guarantee for future results or a prediction of any kind.</p>
                                <p>You should talk to a professional before making any decisions based on the results generated by this calculator.</p>
                                <p>Use It Wisely accepts no liability whatsoever for any loss or costs incurred from the use of this calculator.</p>

                            </div>


                        </div>

                        <!--   <div id="chartContainer" style="height: 300px; width: 100%;"></div> -->

                    </div>
                </div>
            </div>
            <div class="col-md-2"></div>
        </div>
    </div>
</div>
<script>
    function validateRange(input) {
        let value = parseInt(input.value, 10);
        if (value > 110) {
            input.value = 110;
            alert('Age should not be greater than 110')
        } else if (value < 1) {
            input.value = 1;
        } else if (isNaN(value)) {
            input.value = '';
        }
    }
</script>