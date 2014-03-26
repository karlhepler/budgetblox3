<td><div class="grippy"></div></td>
<td class="preferred-bank-checkbox">  
  <div class="checkbox">
    <label class="h4">
      <input name="_banks" type="checkbox" value="<%= _id %>" checked <%= typeof isCustomized === 'undefined' || isCustomized === false ? 'disabled' : '' %>>
      <%= name %>
    </label>
  </div>
</td>