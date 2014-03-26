<div class="h4-container">
	<div class="h4"><%= contactName %></div>
</div>
<div class="new-transactionitem-left">
	<div class="date"><%= date %></div>	
	<div class="desc"><%= desc %></div>
</div>
<div class="new-transactionitem-right">
	<div class="text-color-<%= budgetName ? 'expense' : 'income' %> amount">$<%= amount %></div>
	<div class="budget-name text-color-orange"><%= budgetName %></div>
</div>

<div class="transaction-buttons">
	<button class="btn btn-google"><span class="glyphicon glyphicon-pencil"></span></button>
	<button class="btn btn-google"><span class="glyphicon glyphicon-trash"></span></button>
</div>