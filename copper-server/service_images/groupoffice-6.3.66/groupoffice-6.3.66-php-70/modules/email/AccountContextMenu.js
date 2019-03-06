GO.email.AccountContextMenu = Ext.extend(Ext.menu.Menu,{

	setNode : function(node){
		this.addFolderButton.setDisabled(node.attributes.noinferiors);
		// Disable the properties menu item when you have no manage permission
		this.propertiesBtn.setDisabled((node.attributes.permission_level < GO.permissionLevels.manage));
	},
	initComponent : function(){
		
		this.items=[
		this.addFolderButton = new Ext.menu.Item({
			iconCls: 'btn-add',
			text: t("Add folder", "email"),
			scope:this,
			handler: function(){
				Ext.MessageBox.prompt(t("Name"), t("Enter the folder name:", "email"), function(button, text){
					if(button=='ok')
					{
						var sm = this.treePanel.getSelectionModel();
						var node = sm.getSelectedNode();
				
						GO.request({
							url: "email/folder/create",
							maskEl: Ext.getBody(),
							params: {
								parent: node.attributes.mailbox,
								account_id: node.attributes.account_id,
								name: text
							},
							success: function(options, response, result)
							{								
								this.treePanel.refresh(node);
							},
							fail : function(){
								this.treePanel.refresh();
							},
							scope: this
						});
					}
				}, this);
			}
		}),{
			iconCls : 'btn-settings',
			text : t("Subscribe to folders", "email"),
			scope : this,
			handler : function() {
				if (!this.foldersDialog) {
					this.foldersDialog = new GO.email.FoldersDialog();
				}
				var sm = this.treePanel.getSelectionModel();
				var node = sm.getSelectedNode();
				this.foldersDialog.show(node.attributes.account_id);
			}
		},
		this.propertiesBtn = new Ext.menu.Item({
			iconCls: 'btn-edit',
			text: t("Properties"),
			handler:function(a,b){
				var sm = this.treePanel.getSelectionModel();
				var node = sm.getSelectedNode();

				if(!this.accountDialog){
					this.accountDialog = new GO.email.AccountDialog();
					this.accountDialog.on('save', function(){
						GO.mainLayout.getModulePanel("email").refresh();
						if(GO.email.aliasesStore.loaded)
						{
							GO.email.aliasesStore.reload();
						}
					}, this);
				}

				this.accountDialog.show(node.attributes.account_id);

			},
			scope:this
		})
		];
		
		GO.email.AccountContextMenu.superclass.initComponent.call(this);
	}
}
);
