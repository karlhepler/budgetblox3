<!-- SIDEBAR CONTAINER -->
<div id="sidebar-container" class="sidebar col-md-3">
	
	<div id="date-container">
	  <span class="btn btn-google"><span id="date-back" class="glyphicon glyphicon-chevron-left"></span></span>
	  <span id="date" class="btn btn-google">September 2013</span>
	  <span class="btn btn-google"><span id="date-fwd" class="glyphicon glyphicon-chevron-right"></span></span>
	</div>

	<!-- BALANCE CONTAINER -->
	<div id="balance-container">
		<table>
			<tr class="text-color-income">
				<td>Income</td>
				<td class="incomeTotal">$0.00</td>
			</tr>
			<tr class="text-color-expense">
				<td>Budgeted</td>
				<td class="budgetTotal">$0.00</td>
			</tr>
			<tr>
				<td colspan="2">
					<div class="progress">
					  <div class="progress-bar bg-color-credit" style="width: 10%"></div>
					  <div class="progress-bar bg-color-debit" style="width: 25%"></div>
					  <div class="progress-bar bg-color-ocean" style="width: 5%"></div>
					  <div class="progress-bar bg-color-blue" style="width: 18%"></div>
					  <div class="progress-bar bg-color-orange" style="width: 20%"></div>
					</div>
				</td>
			</tr>
			<tr>
				<td>What's Left</td>
				<td>
					<span class="fund-icon-container"><span class="fund-icon bg-color-credit balance">0.00</span></span>
				</td>
			</tr>
		</table>
	</div>

	
	<!-- BUDGET / BANK ACCORDIAN CONTAINER  -->
	<div id="budget-bank-container">

		<!-- BUDGET PANEL -->
	  <div class="budget-panel panel">
	  	<div class="panel-title">
	      <h3><span data-toggle="collapse" data-parent="#budget-bank-container" data-target="#budget-list" class="btn btn-google">Budgets</span></h3>
	      <div class="btn-group panel-title-buttons">
	      	<button class="btn btn-edit btn-google"><span class="glyphicon glyphicon-pencil"></span></button>
	      	<button class="btn btn-delete btn-google"><span class="glyphicon glyphicon-trash"></span></button>
	      </div>
      </div>
	    <div id="budget-list" class="collapse in"></div>
	  </div>
	
		<!-- BANK PANEL -->
	  <div class="bank-panel panel">
		  <div class="panel-title">
	      <h3><span data-toggle="collapse" data-parent="#budget-bank-container" data-target="#bank-list" class="btn btn-google">Banks</span></h3>
	      <div class="btn-group panel-title-buttons">
	      	<button class="btn btn-edit btn-google"><span class="glyphicon glyphicon-pencil"></span></button>
	      	<button class="btn btn-delete btn-google"><span class="glyphicon glyphicon-trash"></span></button>
	      </div>
      </div>
	    <div id="bank-list" class="collapse"></div>
	  </div>
	</div>


</div>


<div id="new-transactionlist-container" class="col-lg-4 col-md-4 col-md-offset-3">
	
</div>


<!-- INFO CONTAINER -->
<div id="info-container" class="col-lg-5 col-md-5">
	
	<!-- ADD NEW BUTTON -->
	<div id="btn-addnew" class="btn-group">
	  <button type="button" class="btn btn-google dropdown-toggle" data-toggle="dropdown">
	    Add New <span class="caret"></span>
	  </button>
	  <ul class="dropdown-menu" role="menu">
	    <li><a id="btn-addexpense" href="#"><span class="glyphicon glyphicon-minus">&nbsp;</span>Expense</a></li>
	    <li><a id="btn-addincome" href="#"><span class="glyphicon glyphicon-plus">&nbsp;</span>Income</a></li>
	    <li class="divider"></li>
	    <li><a id="btn-addbudget" href="#"><span class="glyphicon glyphicon-usd">&nbsp;</span>Budget</a></li>
	    <li><a id="btn-addbank" href="#"><span class="glyphicon glyphicon-home">&nbsp;</span>Bank</a></li>
	  </ul>
	</div>

	<!-- ACCOUNT BUTTON -->
	<div id="btn-account" class="btn-group pull-right">
	  <button type="button" class="btn btn-google dropdown-toggle" data-toggle="dropdown">
	    <img id="user-pic" src="../images/profile-pic.jpg" class="pull-right">
	    <div class="pull-right hidden-sm hidden-xs">
	    	<div>
	    		<div id="account-name">Hepler Family</div>
	    		<div><span id="user-name">Karl Hepler</span> <span class="caret"></span></div>
	    	</div>	    	
	    </div>
	  </button>
	  <ul class="dropdown-menu" role="menu">
	    <li><a id="btn-accountsettings" href="#"><span class="glyphicon glyphicon-cog">&nbsp;</span>Account Settings</a></li>
	    <li class="divider"></li>
	    <li><a id="btn-logout" href="#"><span class="glyphicon glyphicon-lock">&nbsp;</span>Log Out</a></li>
	  </ul>
	</div>

</div>